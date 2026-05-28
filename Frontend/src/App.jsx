import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // NUEVOS ESTADOS PARA EL CRUD
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUser, setNuevoUser] = useState('');
  const [nuevoPass, setNuevoPass] = useState('');

  const URL_MOCKAPI = "https://6a184e6e1878294b597cd59c.mockapi.io/usuarios";

  # FUNCIÓN PARA TRAER TODOS LOS USUARIOS DESDE LA BD
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(URL_MOCKAPI);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    }
  };

  // Cargar la lista automáticamente al iniciar sesión
  useEffect(() => {
    if (isLoggedIn) {
      obtenerUsuarios();
    }
  }, [isLoggedIn]);

  // LÓGICA DEL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(URL_MOCKAPI);
      const listaUsuarios = await response.json();

      const usuarioValido = listaUsuarios.find(
        (user) => user.username === username && user.password === password
      );

      if (usuarioValido) {
        setIsLoggedIn(true);
        setMensaje(`Bienvenido, ${usuarioValido.username}`);
      } else {
        setIsLoggedIn(false);
        setMensaje("Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  # 1. CREAR UN NUEVO USUARIO (MÉTODO POST)
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(URL_MOCKAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: nuevoUser, password: nuevoPass })
      });

      if (response.ok) {
        setNuevoUser('');
        setNuevoPass('');
        obtenerUsuarios(); // Recargamos la lista en tiempo real
      }
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  # 2. ELIMINAR UN USUARIO (MÉTODO DELETE)
  const handleEliminarUsuario = async (id) => {
    try {
      const response = await fetch(`${URL_MOCKAPI}/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        obtenerUsuarios(); // Recargamos la lista en tiempo real
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#222', color: '#fff' }}>
      
      {!isLoggedIn ? (
        // FORMULARIO DE LOGIN
        <form onSubmit={handleLogin}>
          <h2 style={{ textAlign: 'center' }}>Iniciar Sesión (MockAPI)</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: '1px solid #555' }} required />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: '1px solid #555' }} required />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ingresar</button>
        </form>
      ) : (
        // DASHBOARD ADMINISTRATIVO (CRUD)
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Panel de Control (MockAPI)</h2>
            <button onClick={() => setIsLoggedIn(false)} style={{ padding: '5px 10px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
          </div>
          <p style={{ color: '#28a745' }}>{mensaje}</p>

          <hr style={{ border: '0.5px solid #444', margin: '20px 0' }} />

          {/* FORMULARIO PARA REGISTRAR NUEVOS DATOS */}
          <h3>Agregar Nuevo Usuario</h3>
          <form onSubmit={handleCrearUsuario} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="Usuario" value={nuevoUser} onChange={(e) => setNuevoUser(e.target.value)} style={{ flex: 1, padding: '8px', background: '#333', color: '#fff', border: '1px solid #555' }} required />
            <input type="password" placeholder="Contraseña" value={nuevoPass} onChange={(e) => setNuevoPass(e.target.value)} style={{ flex: 1, padding: '8px', background: '#333', color: '#fff', border: '1px solid #555' }} required />
            <button type="submit" style={{ padding: '8px 15px', background: '#28A745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Añadir</button>
          </form>

          {/* LISTA DINÁMICA DE USUARIOS TRAÍDOS DESDE MOCKAPI */}
          <h3>Usuarios Registrados en la Nube</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {usuarios.map((u) => (
              <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#333', marginBottom: '5px', borderRadius: '4px', border: '1px solid #444' }}>
                <span>👤 <strong>{u.username}</strong> (Pass: {u.password})</span>
                {/* Deshabilitamos borrar el admin principal para no quedarnos afuera */}
                {u.username !== 'admin' && (
                  <button onClick={() => handleEliminarUsuario(u.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLoggedIn && mensaje && (
        <p style={{ color: '#ff3333', marginTop: '15px', textAlign: 'center' }}>{mensaje}</p>
      )}
    </div>
  );
}

export default App;