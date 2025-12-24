export class VRButton {
  static createButton(renderer) {
    const button = document.createElement('button');
    button.id = 'VRButton';
    button.style.cssText = 'position:absolute;bottom:20px;right:20px;padding:12px 24px;border:1px solid white;border-radius:4px;background:rgba(0,0,0,0.6);color:white;font:normal 13px sans-serif;cursor:pointer;pointer-events:auto;';

    const showUnsupported = () => {
      button.textContent = 'VR NOT SUPPORTED';
      button.onclick = null;
    };

    const showEnter = () => {
      button.textContent = 'ENTER VR';
      button.onclick = async () => {
        try {
          const session = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor']
          });
          session.addEventListener('end', () => {
            button.textContent = 'ENTER VR';
          });
          renderer.xr.setSession(session);
          button.textContent = 'EXIT VR';
        } catch (e) {
          if (e?.name === 'AbortError') {
            console.warn('XR session aborted by user');
            button.textContent = 'ENTER VR';
            return;
          }
          console.warn('Failed to start XR session', e);
        }
      };
    };

    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr')
        .then((supported) => {
          if (supported) showEnter();
          else showUnsupported();
        })
        .catch(showUnsupported);
    } else {
      showUnsupported();
    }

    return button;
  }
}
