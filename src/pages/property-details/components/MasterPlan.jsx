import React, { useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const MasterPlan = ({ name, masterPlan }) => {
  const [scale, setScale] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const src = useMemo(() => {
    if (!masterPlan) return null;
    if (typeof masterPlan === "string") return masterPlan;
    return masterPlan?.s3_link ?? masterPlan?.name ?? null;
  }, [masterPlan]);

  if (!masterPlan) return null;

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  const close = () => {
    setIsOpen(false);
    resetZoom();
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">
        {name || "Project"} Master Plan
      </h2>

      <div className="card overflow-hidden border border-border bg-surface">
        <div className="relative aspect-[16/9] bg-secondary-100">
          {src ? (
            <Image
              src={src}
              alt={`${name || "Project"} master plan`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary">
              <Icon name="ImageOff" size={48} />
            </div>
          )}

          {src && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-surface/95 text-primary font-medium rounded-lg shadow-elevation-2 hover:bg-primary-100 transition-colors text-sm"
              >
                View Master Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="bg-surface rounded-xl shadow-elevation-4 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">
                {name || "Project"} master plan
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-primary hover:bg-secondary-100"
                  aria-label="Zoom out"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-primary hover:bg-secondary-100"
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-primary hover:bg-secondary-100"
                  aria-label="Close"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex-1 min-h-0 w-full">
              <Image
                src={src}
                alt="Master plan"
                className="w-full min-w-0 h-auto transition-transform duration-200"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MasterPlan;

