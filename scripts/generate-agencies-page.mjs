import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="https://www.standen.io/">
    <title>Standen | Internal Tools that Automate Agency Client Delivery</title>
    <script>location.replace("/");</script>
</head>
<body><p><a href="/">Continue to Standen</a></p></body>
</html>`;

fs.writeFileSync(path.join(ROOT, "agencies.html"), html, "utf8");
console.log("wrote agencies.html (redirect to /)");
