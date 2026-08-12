type ObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number;
  triggerWhen?: "enters" | "leaves";
};


export function createIntersectionObserver(
  target: Element | null,
  onTriggered: () => void,
  options: ObserverOptions = {}
) {
  if (!target) return () => {};

  const { triggerWhen = "enters", root = null, rootMargin, threshold } = options;

  const resolvedRootMargin = rootMargin ?? (triggerWhen === "enters" ? "160px" : "0px");
  const resolvedThreshold = threshold ?? (triggerWhen === "enters" ? 0.1 : 0);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      const shouldFire = triggerWhen === "enters" ? entry.isIntersecting : !entry.isIntersecting;
      if (shouldFire) onTriggered();
    },
    { root, rootMargin: resolvedRootMargin, threshold: resolvedThreshold }
  );

  observer.observe(target);
  return () => observer.disconnect();
}