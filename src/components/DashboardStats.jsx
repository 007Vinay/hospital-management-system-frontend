function DashboardStats({
    title,

    value,

    color,
}) {
    return (
        <div
            className={`
                ${color}
                text-white
                p-6
                rounded
                shadow-md
            `}
        >
            <h2 className="text-xl font-bold">{title}</h2>

            <p className="text-3xl mt-2">{value}</p>
        </div>
    );
}

export default DashboardStats;
