function ConfirmModal({
    isOpen,

    title,

    message,

    onConfirm,

    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/50
                flex
                justify-center
                items-center
            "
        >
            <div
                className="
                    bg-white
                    p-6
                    rounded
                    shadow-lg
                    w-96
                "
            >
                <h2
                    className="
                        text-xl
                        font-bold
                        mb-4
                    "
                >
                    {title}
                </h2>

                <p className="mb-6">{message}</p>

                <div
                    className="
                        flex
                        justify-end
                        gap-4
                    "
                >
                    <button
                        onClick={onCancel}
                        className="
                            bg-gray-400
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="
                            bg-red-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
