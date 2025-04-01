import { useEffect, useState, RefObject } from "react";

interface UseIntersectionObserverProps {
    target: RefObject<Element>;
    onIntersect: () => void;
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
}

export function useIntersectionObserver({
    target,
    onIntersect,
    threshold = 0.1,
    rootMargin = "0px",
    enabled = true,
}: UseIntersectionObserverProps) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsIntersecting(entry.isIntersecting);
                    if (entry.isIntersecting) {
                        onIntersect();
                    }
                });
            },
            {
                rootMargin,
                threshold,
            }
        );

        const element = target.current;
        if (!element) return;

        observer.observe(element);
        return () => {
            observer.unobserve(element);
        };
    }, [target.current, enabled, onIntersect, rootMargin, threshold]);

    return isIntersecting;
}

export default useIntersectionObserver;
