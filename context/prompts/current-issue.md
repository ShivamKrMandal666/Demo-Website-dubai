Two bugs from the mobile responsiveness pass need fixing:

1. DOCTOR CARDS — FACE CROPPED ON MOBILE (Home page, Doctors section and doctors page)
On mobile, the doctor card divs were resized smaller, but the images are still cropping from their previous object-position, so doctors' faces are now cut off (see attached screenshot — top of head/forehead is cropped). 
Fix by tuning object-position specifically for the mobile breakpoint so the full face stays in frame — similar to how object-position is already being fine-tuned per-image elsewhere in the codebase (e.g. the gallery uses object-position: 50% 20% on at least one image). If object-position alone can't solve it at the current card height, increase the mobile card's minimum height/aspect-ratio instead so there's enough vertical room to frame the face properly without over-cropping.

2. GALLERY INFINITE GRID — ROW DISAPPEARS ON MOBILE SCROLL-UP
On mobile, when dragging/scrolling up in the Gallery's infinite grid, the "down" duplicate grid block disappears/blanks out instead of wrapping smoothly.
My suspicion: this is a dynamic mobile viewport-height issue (the classic 100vh vs 100dvh problem, where the browser address bar showing/hiding changes the viewport height mid-interaction) throwing off the JS logic that determines when to reposition/snap the duplicate tile blocks in the 2x2 super-grid. Please investigate whether the component's height/position calculations use 100vh, window.innerHeight, or similar static viewport values, and switch to 100dvh (dynamic viewport height) or a ResizeObserver-based approach if so. If that's not the root cause, please diagnose and report back what's actually happening before applying a fix, since this only reproduces on mobile drag/touch and not desktop.

Please fix and report what you find for #2, since I want to confirm the actual cause before considering it resolved.