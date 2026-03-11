import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import { formatPriceForDisplay } from "../../../utils/indianFormatters";

const DEFAULT_PHONE = "+919873040405";

const FloorPlan = ({ plans, name, contactPhone }) => {
  const [floorPlanCategory, setFloorPlanCategory] = useState("");
  const [scale, setScale] = useState(1);
  const [modalItem, setModalItem] = useState(null);
  const [modalPlan, setModalPlan] = useState(null);

  const phone = contactPhone || DEFAULT_PHONE;

  useEffect(() => {
    if (plans?.length > 0) {
      const first = categoryName(plans[0]);
      if (first) setFloorPlanCategory(first);
    }
  }, [plans]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  const openModal = (item, plan) => {
    setModalItem(item);
    setModalPlan(plan);
    setScale(1);
  };

  const closeModal = () => {
    setModalItem(null);
    setModalPlan(null);
    resetZoom();
  };

  const categoryName = (plan) => {
    const c = plan?.category;
    if (!c) return null;
    return typeof c === "object" && c?.name ? c.name : String(c);
  };

  const uniqueCategories = Array.from(
    new Map(
      plans?.map((p) => {
        const name = categoryName(p);
        return [name?.toLowerCase?.() ?? name, name];
      }) ?? []
    ).values()
  ).filter(Boolean);

  const filteredPlan = plans?.filter(
    (plan) =>
      categoryName(plan)?.toLowerCase()?.trim() ===
      floorPlanCategory?.toLowerCase()?.trim()
  );

  const isCallForPrice = (value) => {
    if (value == null || value === "") return true;
    const s = String(value).toLowerCase().trim();
    return (
      s === "call for price" ||
      s === "on request" ||
      s === "0"
    );
  };

  const imageUrl = (item) =>
    item?.image?.s3_link ?? item?.image?.name ?? null;

  if (!plans?.length) return null;

  const currentPlan = filteredPlan?.[0];
  const floorPlans = currentPlan?.floor_plans ?? [];
  const sizeSq = currentPlan?.size_sq ? String(currentPlan.size_sq) : "Sq.Ft.";

  return (
    <section className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">
        {name || "Project"} Floor Plan
      </h2>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {uniqueCategories.map((catName, i) => {
          const label = `${catName} floor plan`;
          const isActive =
            catName?.toLowerCase()?.trim() ===
            floorPlanCategory?.toLowerCase()?.trim();
          return (
            <button
              type="button"
              key={i}
              onClick={() => setFloorPlanCategory(catName)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
                isActive
                  ? "bg-primary-100 text-primary border-primary"
                  : "bg-surface text-text-secondary border-border hover:border-primary hover:text-primary"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Floor plan cards - horizontal scroll */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
        <div className="flex gap-6 flex-nowrap">
        {floorPlans.map((item, i) => {
          const imgUrl = imageUrl(item);
          const title = [item?.name, item?.area, sizeSq].filter(Boolean).join(" ");
          return (
            <div
              key={i}
              className="card overflow-hidden border border-border bg-surface flex-shrink-0 w-[min(100%,280px)] sm:w-72"
            >
              <div className="relative aspect-[4/3] bg-secondary-100">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={title || "Floor plan"}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-secondary">
                    <Icon name="ImageOff" size={48} />
                  </div>
                )}
                {imgUrl && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex justify-center">
                    <button
                      type="button"
                      onClick={() => openModal(item, currentPlan)}
                      className="px-4 py-2 bg-surface text-primary font-medium rounded-lg shadow-elevation-2 hover:bg-primary-100 transition-colors text-sm"
                    >
                      View Floor Plan
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">
                  {title || "—"}
                </h3>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">
                    Sale Price
                  </p>
                  {isCallForPrice(item?.sale_price) ? (
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="text-sm font-medium text-error hover:underline"
                    >
                      Call For Price
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-text-primary">
                      {formatPriceForDisplay(item?.sale_price)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {floorPlans.length === 0 && (
        <p className="text-text-secondary py-6">No floor plans in this category.</p>
      )}

      {/* Modal */}
      {modalItem && modalPlan && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-surface rounded-xl shadow-elevation-4 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">
                {[modalItem?.name, modalItem?.area, modalPlan?.size_sq]
                  .filter(Boolean)
                  .join(" ")}{" "}
                floor plan
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
                  onClick={closeModal}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-primary hover:bg-secondary-100"
                  aria-label="Close"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto flex-1 min-h-0 w-full">
              <img
                src={imageUrl(modalItem)}
                alt="Floor plan"
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

export default FloorPlan;
