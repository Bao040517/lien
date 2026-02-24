import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, BarChart3 } from 'lucide-react';

const SellerRevenue = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalSold: 0,
        revenueChart: []
    });

    useEffect(() => {
        if (!user) return;

        api.get('/seller/statistics', {
            params: { sellerId: user.id }
        })
            .then(res => {
                const data = res.data.data || res.data;
                setStats({
                    totalRevenue: data.totalRevenue || 0,
                    totalOrders: data.totalOrders || 0,
                    totalSold: data.totalSold || 0,
                    revenueChart: data.revenueChart || []
                });
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, [user]);

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

    // Format chart date
    const formattedChartData = stats.revenueChart.map(item => {
        const dateStr = item.label || item.date || item[0] || '';
        const revenue = item.value !== undefined ? item.value : (item.revenue || item[1] || 0);

        // Cố gắng parse ngày tháng cho đẹp
        let displayDate = dateStr;
        let monthObj = '';
        let timestamp = 0;
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                displayDate = `${d.getDate()}/${d.getMonth() + 1}`;
                monthObj = `${d.getMonth() + 1}/${d.getFullYear()}`;
                timestamp = d.getTime();
            }
        } catch (e) { }

        return {
            name: displayDate,
            revenue: revenue,
            month: monthObj,
            timestamp: timestamp
        };
    });

    // Gom nhóm theo tháng
    const monthlyRevenueMap = {};
    formattedChartData.forEach(item => {
        if (item.month) {
            monthlyRevenueMap[item.month] = (monthlyRevenueMap[item.month] || 0) + item.revenue;
        }
    });

    // Sort array by month naturally (assuming MM/YYYY format)
    const monthlyChartData = Object.keys(monthlyRevenueMap).map(monthKey => {
        return {
            name: monthKey,
            revenue: monthlyRevenueMap[monthKey]
        }
    }).sort((a, b) => {
        const [mA, yA] = a.name.split('/').map(Number);
        const [mB, yB] = b.name.split('/').map(Number);
        if (yA !== yB) return yA - yB;
        return mA - mB;
    });

    // Filter chart data based on date range
    let filteredChartData = formattedChartData;
    if (startDate || endDate) {
        filteredChartData = formattedChartData.filter(item => {
            if (!item.timestamp) return true; // If we couldn't parse it, just keep it

            const itemDate = new Date(item.timestamp);
            itemDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const sDate = new Date(startDate);
                sDate.setHours(0, 0, 0, 0);
                if (itemDate < sDate) return false;
            }
            if (endDate) {
                const eDate = new Date(endDate);
                eDate.setHours(23, 59, 59, 999);
                if (itemDate > eDate) return false;
            }
            return true;
        });
    }

    const formatCompactPrice = (val) => {
        if (val === 0) return '0đ';
        if (val < 1000) return `${val}đ`;
        return new Intl.NumberFormat('vi-VN', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        }).format(val).replace(/T/, 'Tr'); // Đổi T thành Tr nếu JS locales dùng T cho Nghìn tỷ/Triệu (Tùy trình duyệt) 
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">{label}</p>
                    <p className="font-bold text-orange-600 text-lg">
                        {formatPrice(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
                <p>Đang tải dữ liệu doanh thu...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-7 h-7 text-orange-500" />
                    Báo Cáo Doanh Thu
                </h1>
                <p className="text-gray-500 mt-1">Theo dõi hoạt động kinh doanh và tăng trưởng của Shop</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-green-800/70 font-medium text-sm mb-1 uppercase tracking-wider">Tổng Doanh Thu</p>
                            <h3 className="text-3xl font-bold text-green-700">{formatPrice(stats.totalRevenue)}</h3>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-green-500">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-blue-800/70 font-medium text-sm mb-1 uppercase tracking-wider">Tổng Đơn Hàng</p>
                            <h3 className="text-3xl font-bold text-blue-700">{stats.totalOrders}</h3>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-blue-500">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-6 rounded-2xl border border-purple-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-purple-800/70 font-medium text-sm mb-1 uppercase tracking-wider">Sản Phẩm Đã Bán</p>
                            <h3 className="text-3xl font-bold text-purple-700">{stats.totalSold}</h3>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-purple-500">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                            Biểu Đồ Doanh Thu Theo Ngày
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer"
                                title="Từ ngày"
                            />
                            <span>-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer"
                                title="Đến ngày"
                            />
                            {(startDate || endDate) && (
                                <button onClick={() => { setStartDate(''); setEndDate(''); }} className="ml-2 text-orange-500 hover:text-orange-600 font-medium">Xóa</button>
                            )}
                        </div>
                    </div>
                    {filteredChartData.length > 0 ? (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 13 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        tickFormatter={formatCompactPrice}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 13 }}
                                        dx={-10}
                                        width={60}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: '#fff7ed' }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#f97316"
                                        radius={[6, 6, 0, 0]}
                                        barSize={30}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            <BarChart3 className="w-12 h-12 text-gray-300 mb-3" />
                            <p>Chưa có dữ liệu doanh thu hàng ngày để hiển thị</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                        Biểu Đồ Doanh Thu Theo Tháng
                    </h3>
                    {monthlyChartData.length > 0 ? (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 13 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        tickFormatter={formatCompactPrice}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 13 }}
                                        dx={-10}
                                        width={60}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: '#eff6ff' }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#3b82f6"
                                        radius={[6, 6, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            <BarChart3 className="w-12 h-12 text-gray-300 mb-3" />
                            <p>Chưa có dữ liệu doanh thu hàng tháng để hiển thị</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerRevenue;
