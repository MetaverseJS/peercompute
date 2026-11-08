const DEFAULT_ICE_SERVERS = Object.freeze([
  Object.freeze({ urls: 'stun:stun.l.google.com:19302' })
]);

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const normalizeIceServers = (value) => {
  if (!value) return [];
  const servers = Array.isArray(value) ? value : [value];
  return servers.flatMap((server) => {
    if (typeof server === 'string') {
      const urls = server.trim();
      return urls ? [{ urls }] : [];
    }
    if (!isObject(server)) return [];
    const rawUrls = server.urls ?? server.url;
    if (!rawUrls) return [];
    const urls = (Array.isArray(rawUrls) ? rawUrls : [rawUrls])
      .map((url) => String(url).trim())
      .filter(Boolean);
    if (urls.length === 0) return [];
    return [{
      ...server,
      urls: Array.isArray(rawUrls) ? urls : urls[0]
    }];
  });
};

export const buildCubeChatRtcConfiguration = (webrtc) => {
  const normalizedWebRTC = isObject(webrtc) ? webrtc : {};
  const rtcConfiguration = isObject(normalizedWebRTC.rtcConfiguration)
    ? { ...normalizedWebRTC.rtcConfiguration }
    : {};
  const directIceServers = normalizeIceServers(normalizedWebRTC.iceServers);
  const nestedIceServers = normalizeIceServers(rtcConfiguration.iceServers);
  const iceServers = directIceServers.length > 0
    ? directIceServers
    : nestedIceServers.length > 0
      ? nestedIceServers
      : normalizeIceServers(DEFAULT_ICE_SERVERS);

  return {
    ...rtcConfiguration,
    iceServers
  };
};
