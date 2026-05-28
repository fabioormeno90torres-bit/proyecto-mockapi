import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Tu URL directa al recurso de usuarios en MockAPI
      const URL_MOCKAPI = "https://6a184e6e1878294b597cd59c.mockapi.io/usuarios";

      const response = await fetch(URL_MOCKAPI);
      const listaUsuarios = await response.json();

      // Buscamos si las credenciales coinciden con algún registro de la nube
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
      console.error("Error al conectar con MockAPI:", error);
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#222', color: '#fff' }}>
      
      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <h2 style={{ textAlign: 'center' }}>Iniciar Sesión (MockAPI)</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', background: '#333', color: '#fff', border: '1px solid #555' }}
              required 
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', background: '#333', color: '#fff', border: '1px solid #555' }}
              required 
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Ingresar
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2>¡Dashboard del Sistema!</h2>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>{mensaje}</p>
          <p>Este panel consume los datos directamente desde MockAPI.io.</p>
          <button onClick={() => { setIsLoggedIn(false); setMensaje(''); }} style={{ padding: '8px 15px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </div>
      )}

      {!isLoggedIn && mensaje && (
        <p style={{ color: '#ff3333', marginTop: '15px', textAlign: 'center' }}>{mensaje}</p>
      )}
    </div>
  );
}

export default App;