FROM mcr.microsoft.com/playwright:v1.57.0-noble

ENV DEBIAN_FRONTEND=noninteractive
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
LABEL org.peercompute.chaoslab.image-rev="20260216-playwright-runtime"

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    iproute2 \
    iptables \
    iputils-ping \
    dnsmasq \
    caddy \
    coturn \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /opt/chaoslab \
  && npm install --prefix /opt/chaoslab --omit=dev playwright@1.57.0

CMD ["sleep", "infinity"]
