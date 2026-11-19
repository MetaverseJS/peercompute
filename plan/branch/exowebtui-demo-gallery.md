# ExoWebTUI demo gallery

Branch `feature/exowebtui-demo-gallery` starts at `18a2182d` on `feature/ipfs-artifacts-webgpu`.

- Run the demo landing page as a custom window in the ExoWebTUI desktop from the Exotui project. Let the native launcher and the accessible HTML directory share the existing demo routes.
- Keep the preview available on Tailscale for operator testing. Verify a desktop viewport, a phone viewport, demo navigation, search, filtering, and the HTML fallback.

Follow-up: use the tech-stack desktop’s cell typography, shaders, wallpaper and settings. Launch demos in independently managed iframe windows with the same visual treatment as the desktop. The visible product name is **PeerCompute**.

The screenshot on November 18 clarified the visual requirement. Compose live iframe pixels and desktop cells in the same input texture before all native shader passes, including their desktop-wide distortion. Preserve native controls and gracefully show the live frame on browsers that cannot supply the pixels.

November 18 follow-up: keep all visible clients painting while desktop overlays are open. Only the part physically covered by menus, the switcher or a higher window is obscured. Switching, minimizing and restoring live demos should preserve their running documents and avoid a blank frame.

November 19 follow-up: show the desktop startup state immediately. Keep the HTML directory available during startup and restore it after a bundle or presenter failure. Selecting an entry previews the demo; **Open demo** launches it. Give each of the 17 entries a source-backed summary and make the directory usable as a list above a preview on phones.
