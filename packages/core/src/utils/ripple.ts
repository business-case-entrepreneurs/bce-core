export const ripple = (el: Element, event: MouseEvent) => {
  // Create ripple element at mouse position
  const ripple = document.createElement('bce-ripple');
  const rect = el.getBoundingClientRect();
  ripple.x = event.clientX - rect.left;
  ripple.y = event.clientY - rect.top;

  // Append ripple to button & remove after 500ms
  el.appendChild(ripple);
  setTimeout(() => ripple.parentElement!.removeChild(ripple), 500);
};
