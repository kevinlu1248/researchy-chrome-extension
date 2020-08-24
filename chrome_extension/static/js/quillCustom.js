var quill = new Quill("#editor", {
    modules: {
        toolbar: [
            [{ header: 1 }, { header: 2 }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [
                { script: "sub" },
                { script: "super" },
                "blockquote",
                "code-block",
                "formula",
            ],
            [{ color: [] }, { background: [] }],
        ],
    },
    theme: "snow",
});

[
    [{ header: 1 }, { header: 2 }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [
        { script: "sub" },
        { script: "super" },
        "blockquote",
        "code-block",
        "formula",
    ],
    [{ color: [] }, { background: [] }],
];
