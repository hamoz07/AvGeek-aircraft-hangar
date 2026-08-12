export const scrollIntoView = (index: number,myRef: React.RefObject<HTMLElement | null>) => {
    const item = myRef.current;
    if (item) {
      const activeItem = item.children[index] as HTMLElement;
      activeItem?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };