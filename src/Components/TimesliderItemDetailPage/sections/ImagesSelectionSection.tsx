/** Thumbnail row / gallery strip — content TBD. */
export default function ImagesSelectionSection() {
  return (
    <section
      className="flex h-36 shrink-0 items-center border-t border-gray-200 bg-white px-4"
      aria-label="Afbeeldingen selectie"
    >
      <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50">
        <span className="text-xs text-gray-400">Images selection</span>
      </div>
    </section>
  );
}
