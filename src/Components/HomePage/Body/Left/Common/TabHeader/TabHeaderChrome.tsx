export function TabHeaderChrome({
  visible,
  title,
  onClose,
}: {
  visible: boolean;
  title: string | undefined;
  onClose: () => void;
}) {
  return (
    <div>
      {visible && (
        <>
          <div className="relative flex items-center justify-center mt-2">
            <h4 className="text-md text-gray-400">{title}</h4>
            <button
              onClick={onClose}
              className="bg-transparent text-gray-500 text-lg font-bold absolute right-2 -top-1"
            >
              x
            </button>
          </div>
          <div className="h-[1px] w-full bg-gray-200 mt-3" />
        </>
      )}
    </div>
  );
}
