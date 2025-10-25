using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Core
{
    public static class Extensions
    {
        public static Task<TokenValidationResult> ValidateToken(this string token, IEnumerable<string> validAudiences, string validIssuer, string securityKey)
        {
            if (string.IsNullOrEmpty(token))
                throw new APIException(StatusCodes.Status401Unauthorized, "Token can not be Empty");

            validAudiences = validAudiences.Append(validIssuer);
            var key = Encoding.ASCII.GetBytes(securityKey);

            TokenValidationParameters tokenParams = new()
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                //ValidAudience = validAudience,
                ValidAudiences = validAudiences,
                ValidIssuer = validIssuer,
                ValidAlgorithms = new string[] { SecurityAlgorithms.Aes256CbcHmacSha512 },

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };

            var result = new JwtSecurityTokenHandler().ValidateTokenAsync(token, tokenParams);

            return result;
        }

        public static string ToLikeFilterString(this string value, Operator compareOperator)
        {
            if (!string.IsNullOrEmpty(value))
                return string.Empty;

            var retVal = value.Replace("[", "[[]")
                                     .Replace("_", "[_]")
                                     .Replace("%", "[%]");

            retVal = compareOperator switch
            {
                Operator.Contains => retVal = $"%{value}%",
                Operator.StartsWith => retVal = $"{value}%",
                Operator.EndsWith => retVal = $"%{value}",
                _ => retVal = retVal.Trim()
            };

            return retVal;
        }
    }
}
