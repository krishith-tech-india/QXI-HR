import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { TINYMCE_API_KEY } from "../config/apiConfig";

const RichTextEditor = ({ value = "", onChange, readOnly = false }) => {
    const tinymceApiKey = TINYMCE_API_KEY;

    return (
        <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            {...(tinymceApiKey ? { apiKey: tinymceApiKey } : {})}
            value={value}
            onEditorChange={(content) => onChange?.(content)}
            init={{
                license_key: "gpl",
                base_url: "/tinymce",
                suffix: ".min",
                height: 320,
                menubar: false,
                branding: false,
                readonly: readOnly,
                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "table",
                    "wordcount",
                ],
                toolbar:
                    "undo redo | blocks fontfamily fontsize | " +
                    "bold italic underline | alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | link | removeformat",
                content_style:
                    "body { font-family: Inter, sans-serif; font-size: 16px; line-height: 1.6; }",
            }}
        />
    );
};

export default RichTextEditor;
