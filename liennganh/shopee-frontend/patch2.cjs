const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin/AdminProducts.jsx', 'utf8');

if (!code.includes('import ConfirmModal')) {
    code = code.replace(/import { Package, Search.*?lucide-react';/, "import { Search, Plus, Trash2, Edit, Save, X, Ban, Settings, CheckCircle, Package, ExternalLink, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';\nimport ConfirmModal from '../../components/Admin/ConfirmModal';\nimport PromptModal from '../../components/Admin/PromptModal';");
}


let modalStates = `
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', targetId: null, action: '' });
    const [promptModal, setPromptModal] = useState({ isOpen: false, title: '', message: '', targetId: null, targetName: '' });
`;
if (!code.includes('confirmModal') && code.includes('const productsPerPage = 10;')) {
    code = code.replace('const productsPerPage = 10;', 'const productsPerPage = 10;' + modalStates);
}

let deleteLogic = `
    const handleDelete = (id, name) => {
        setConfirmModal({
            isOpen: true,
            type: 'danger',
            title: \`Xoá sản phẩm "\${name}"?\`,
            message: 'Hành động này không thể hoàn tác.',
            targetId: id,
            action: 'delete'
        });
    };

    const confirmDelete = async (id) => {
        try {
            await api.delete(\`/products/\${id}\`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch { alert('Xoá thất bại!'); }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };
`;

code = code.replace(/const handleDelete = async .*?Xoá thất bại.*?\};\n/s, deleteLogic);

let banLogic = `
    const handleBan = (id, name) => {
        setPromptModal({
            isOpen: true,
            title: \`Khóa sản phẩm "\${name}"\`,
            message: 'Vui lòng nhập lý do khóa sản phẩm:',
            targetId: id,
            targetName: name
        });
    };

    const confirmBan = async (reason) => {
        const id = promptModal.targetId;
        try {
            await api.put(\`/products/\${id}/ban\`, null, { params: { reason } });
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, banned: true, isBanned: true, violationReason: reason } : p
            ));
        } catch (e) {
            alert('Khóa thất bại: ' + (e.response?.data?.message || e.message));
        }
        setPromptModal(prev => ({ ...prev, isOpen: false }));
    };
`;
code = code.replace(/const handleBan = async .*?violationReason: reason \}.*?Khóa thất bại.*?\};\n/s, banLogic);

let unbanLogic = `
    const handleUnban = (id, name) => {
        setConfirmModal({
            isOpen: true,
            type: 'success',
            title: \`Mở khóa sản phẩm "\${name}"?\`,
            message: 'Sản phẩm sẽ được hiển thị trở lại bình thường.',
            targetId: id,
            action: 'unban'
        });
    };

    const confirmUnban = async (id) => {
        try {
            await api.put(\`/products/\${id}/unban\`);
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, banned: false, isBanned: false, violationReason: null } : p
            ));
        } catch (e) {
            alert('Mở khóa thất bại: ' + (e.response?.data?.message || e.message));
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };
`;
code = code.replace(/const handleUnban = async .*?Mở khóa cho sản phẩm.*?violationReason: null \}.*?Mở khóa thất bại.*?\};\n/s, unbanLogic);

let modalsStr = `
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                type={confirmModal.type}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={() => {
                    if (confirmModal.action === 'delete') confirmDelete(confirmModal.targetId);
                    else if (confirmModal.action === 'unban') confirmUnban(confirmModal.targetId);
                }}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />

            <PromptModal
                isOpen={promptModal.isOpen}
                title={promptModal.title}
                message={promptModal.message}
                defaultValue="Vi phạm tiêu chuẩn cộng đồng"
                placeholder="Nhập lý do..."
                onConfirm={confirmBan}
                onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
`;
code = code.replace(/(<\/div>\s*<\/div>\s*)(<\/div>\s*\);\s*\};)/, '$1' + modalsStr + ');\n};');

fs.writeFileSync('src/pages/Admin/AdminProducts.jsx', code);
console.log('AdminProducts.jsx patched via node.');
