function EmptyState({ message = "No data found" }) {
    return (
        <div
            className="
                text-center
                p-8
                text-gray-500
                font-medium
            "
        >
            {message}
        </div>
    );
}

export default EmptyState;