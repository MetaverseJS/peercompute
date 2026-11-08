/** Resolve the gallery without relying on browser history or an external referrer. */
export function resolveOverviewUrl(href) {
  const url = new URL(href);
  const mode = url.searchParams.get('prod') === '1' ? 'prod'
    : url.searchParams.get('dev') === '1' ? 'dev' : null;
  const dedicatedDemo = ['5189', '5176', '5187'].includes(url.port)
    && /^\/(?:index\.html)?$/.test(url.pathname);
  if (dedicatedDemo) {
    url.port = '4173';
    url.pathname = '/';
  } else {
    url.pathname = url.pathname.replace(/\/(?:inference|cubechat|earth)(?:\/index\.html|\/)?$/, '/');
  }
  url.search = mode ? `?${mode}=1` : dedicatedDemo ? '?dev=1' : '';
  url.hash = '';
  return url.href;
}
