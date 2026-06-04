export const SERVICE_ANCHORS = {
    "agency-proposal-systems": "service-proposals",
    "agency-reporting-dashboard": "service-reporting",
    "agency-client-portal": "service-portals",
    "agency-internal-crm": "service-crm",
    "saas-mvp-development": "service-saas",
    "internal-tools-for-agencies": "service-internal",
};

export function servicesHubHref() {
    return "/#services";
}

export function serviceHref(slug) {
    if (slug === "saas-mvp-development") return "/#services";
    const anchor = SERVICE_ANCHORS[slug];
    return anchor ? `/#${anchor}` : "/#services";
}

export function redirectPage(dest, title = "Services") {
    const safeDest = dest.startsWith("/") ? dest : `/${dest}`;
    const safeTitle = String(title).replace(/[<>&"]/g, "");
    return `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="https://www.standen.io${safeDest}">
    <title>${safeTitle} | Standen</title>
    <script>location.replace("${safeDest}");</script>
</head>
<body><p><a href="${safeDest}">Continue to Standen services</a></p></body>
</html>`;
}
