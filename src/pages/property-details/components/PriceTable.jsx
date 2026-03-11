import React from "react";
import { formatPriceForDisplay } from "../../../utils/indianFormatters";

const DEFAULT_PHONE = "+919873040405";

const PriceTable = ({ plans, contactPhone }) => {
  const phone = contactPhone || DEFAULT_PHONE;
  const areaUnit = plans?.[0]?.size_sq ? String(plans[0].size_sq) : "Sq.Ft.";

  const rows = [];
  plans?.forEach((plan) => {
    plan?.floor_plans?.forEach((item, i) => {
      rows.push({
        key: `${plan?.id ?? i}-${item?.id ?? i}`,
        name: item?.name,
        area: item?.area,
        sale_price: item?.sale_price,
        rent_price: item?.rent_price,
      });
    });
  });

  const isCallForPrice = (value) => {
    if (value == null || value === "") return true;
    const s = String(value).toLowerCase().trim();
    return s === "call for price" || s === "on request" || s === "0";
  };

  if (!rows?.length) return null;

  return (
    <section className="mt-6">
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse">
            <thead>
              <tr className="bg-secondary-100/80">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">
                  Type
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary">
                  Area ({areaUnit})
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary">
                  Price (Rs.)
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.key}
                  className={`border-t border-border/80 ${
                    index % 2 === 0 ? "bg-surface" : "bg-secondary-50/50"
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-text-primary">
                    {row.name ?? "—"}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-primary text-center">
                    {row.area ?? "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isCallForPrice(row.sale_price) ? (
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="text-sm font-medium text-error hover:underline"
                      >
                        Call for Price
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-text-primary">
                        {formatPriceForDisplay(row.sale_price)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PriceTable;
