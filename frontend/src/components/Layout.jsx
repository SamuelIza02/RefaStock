import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      
      {/* Contenido principal a la derecha */}
      <div style={{ marginLeft: '250px', width: '100%', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
