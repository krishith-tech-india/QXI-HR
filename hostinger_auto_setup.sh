#!/usr/bin/env bash
#
# One-time helper to create an encrypted automation SSH key and config entry.
# Safe on macOS; no shred used. Rolls back if something fails.
#
set -euo pipefail

KEY_BASE="${HOME}/.ssh/id_ed25519_hostinger_auto"
KEY_PUB="${KEY_BASE}.pub"
KEY_ENC="${KEY_BASE}.enc"
KEY_TMP="${KEY_BASE}.active"
CONFIG="${HOME}/.ssh/config"
CONFIG_BAK="${CONFIG}.bak-hostinger-auto"
BIN_DIR="${HOME}/bin"
SUCCESS=0

rollback() {
  if [ $SUCCESS -eq 0 ]; then
    echo "Rolling back partial setup..."
    rm -f "$KEY_BASE" "$KEY_PUB" "$KEY_ENC" "$KEY_TMP"
    rm -f "${BIN_DIR}/hostinger-auto-on.sh" "${BIN_DIR}/hostinger-auto-off.sh"
    if [ -f "$CONFIG_BAK" ]; then
      mv "$CONFIG_BAK" "$CONFIG"
    fi
  else
    rm -f "$CONFIG_BAK"
  fi
}
trap rollback EXIT

# Pre-flight checks
if [ -e "$KEY_BASE" ] || [ -e "$KEY_PUB" ] || [ -e "$KEY_ENC" ] || [ -e "$KEY_TMP" ]; then
  echo "Key files already exist at $KEY_BASE*; aborting."
  exit 1
fi

# Backup SSH config if it exists
if [ -f "$CONFIG" ]; then
  cp "$CONFIG" "$CONFIG_BAK"
else
  touch "$CONFIG"
fi
chmod 600 "$CONFIG"

# Generate keypair (no passphrase)
ssh-keygen -t ed25519 -f "$KEY_BASE" -N "" -C "hostinger-auto-$(hostname)"

# Encrypt private key with user-supplied password
openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt -in "$KEY_BASE" -out "$KEY_ENC"
chmod 600 "$KEY_ENC"

# Remove plaintext private key; keep .pub
rm -f "$KEY_BASE"

# Ensure .ssh perms
chmod 700 "${HOME}/.ssh"

# Append host entry
cat <<'EOF' >> "$CONFIG"

Host hostinger-vps-automate
  HostName 147.93.110.204
  User vicky
  IdentityFile ~/.ssh/id_ed25519_hostinger_auto.active
  IdentitiesOnly yes
EOF

# Create activation/deactivation scripts
mkdir -p "$BIN_DIR"
chmod 700 "$BIN_DIR"

cat <<'EOF' > "${BIN_DIR}/hostinger-auto-on.sh"
#!/usr/bin/env bash
set -euo pipefail
KEY_ENC="${HOME}/.ssh/id_ed25519_hostinger_auto.enc"
KEY_TMP="${HOME}/.ssh/id_ed25519_hostinger_auto.active"
[ -f "$KEY_ENC" ] || { echo "Encrypted key missing: $KEY_ENC"; exit 1; }
read -s -p "Enter key password: " pass; echo
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in "$KEY_ENC" -out "$KEY_TMP" -pass pass:"$pass"
chmod 600 "$KEY_TMP"
ssh-add "$KEY_TMP"
echo "Key loaded. Use: ssh hostinger-vps-automate"
EOF
chmod 700 "${BIN_DIR}/hostinger-auto-on.sh"

cat <<'EOF' > "${BIN_DIR}/hostinger-auto-off.sh"
#!/usr/bin/env bash
set -euo pipefail
KEY_TMP="${HOME}/.ssh/id_ed25519_hostinger_auto.active"
if [ -f "$KEY_TMP" ]; then
  ssh-add -d "$KEY_TMP" || true
  rm -f "$KEY_TMP"
  echo "Key removed from agent and disk."
else
  ssh-add -D >/dev/null 2>&1 || true
  echo "No temp key file; agent cleared."
fi
ssh-add -l 2>/dev/null || true
EOF
chmod 700 "${BIN_DIR}/hostinger-auto-off.sh"

SUCCESS=1
echo "Setup complete."
echo "Next: copy the public key to the server (user vicky):"
echo "  PUBKEY=\$(cat \"$KEY_PUB\")"
echo "  ssh hostinger-vps-vicky \"mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo \\\"\\$PUBKEY\\\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys\""
echo "Then activate with: ~/bin/hostinger-auto-on.sh"
echo "Deactivate with:     ~/bin/hostinger-auto-off.sh"
