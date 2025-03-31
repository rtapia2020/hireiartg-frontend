
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [archivo, setArchivo] = useState(null);
  const [analisis, setAnalisis] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState({ email: "", password: "" });
  const [adminMode, setAdminMode] = useState(false);
  const [candidatos, setCandidatos] = useState([]);

  useEffect(() => {
    const auth = localStorage.getItem("hirebot-auth");
    if (auth === "true") {
      setAutenticado(true);
      setAdminMode(localStorage.getItem("hirebot-role") === "admin");
    }
  }, []);

  const handleLogin = () => {
    if (usuario.email === "admin" && usuario.password === "1234") {
      setAutenticado(true);
      setAdminMode(true);
      localStorage.setItem("hirebot-auth", "true");
      localStorage.setItem("hirebot-role", "admin");
    } else if (usuario.email === "user" && usuario.password === "123") {
      setAutenticado(true);
      setAdminMode(false);
      localStorage.setItem("hirebot-auth", "true");
      localStorage.setItem("hirebot-role", "user");
    } else {
      alert("Credenciales inválidas");
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    setAdminMode(false);
    localStorage.removeItem("hirebot-auth");
    localStorage.removeItem("hirebot-role");
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setArchivo(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://hireiartg-backend.onrender.com/analyze", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      setAnalisis(result);
      setCandidatos((prev) => [...prev, result]);
    } catch (error) {
      console.error("Error al analizar el CV:", error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', background: 'linear-gradient(to bottom, #0D0221, #1B003B)', color: '#E0B0FF' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
        <h1>HireBot AI</h1>
        {autenticado && (<button onClick={handleLogout}>Cerrar sesión</button>)}
      </header>

      {!autenticado ? (
        <motion.section
          style={{ maxWidth: 400, margin: '0 auto' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Inicia sesión</h2>
          <input style={{ width: "100%", fontSize: "1.2rem" }} type="text" placeholder="Usuario" onChange={(e) => setUsuario({ ...usuario, email: e.target.value })} />
          <input style={{ width: "100%", fontSize: "1.2rem" }} type="password" placeholder="Contraseña" onChange={(e) => setUsuario({ ...usuario, password: e.target.value })} />
          <button style={{ width: "100%", fontSize: "1.2rem" }} onClick={handleLogin}>Entrar</button>
        </motion.section>
      ) : adminMode ? (
        <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
          <div>
            <h3>Subir CV desde admin</h3>
            <input type="file" accept=".pdf" onChange={handleUpload} />
            {archivo && <p>Archivo seleccionado: {archivo.name}</p>}
            {analisis && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  style={{
                    marginBottom: '1rem',
                    backgroundColor: '#8E2DE2',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 0 10px #8E2DE2'
                  }}
                  onClick={() => {
                    const text = `
Nombre: ${analisis.nombre}
Puntaje IA: ${analisis.puntaje}
Resumen: ${analisis.resumen}
Skills: ${analisis.skills?.join(', ')}
Recomendación: ${analisis.recomendacion}
`;
                    const blob = new Blob([text], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = "analisis-cv.pdf";
                    link.click();
                  }}
                >
                  Descargar análisis en PDF
                </button>
                <div>
                  <p><strong>Nombre:</strong> {analisis.nombre}</p>
                  <p><strong>Puntaje IA:</strong> {analisis.puntaje}</p>
                  <p><strong>Resumen:</strong> {analisis.resumen}</p>
                  <p><strong>Skills:</strong> {analisis.skills?.join(', ')}</p>
                  <p><strong>Recomendación:</strong> {analisis.recomendacion}</p>
                </div>
              </div>
            )}
          </div>
          <h2>Panel de Administración</h2>
          {candidatos.map((c, idx) => (
            <div key={idx} style={{ border: '1px solid #5D00A3', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
              <h3>{c.nombre || 'Candidato sin nombre'}</h3>
              <p><strong>Puntaje IA:</strong> {c.puntaje}</p>
              <p><strong>Resumen:</strong> {c.resumen}</p>
              <p><strong>Skills:</strong> {c.skills?.join(', ')}</p>
              <p><strong>Recomendación:</strong> {c.recomendacion}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <section style={{ textAlign: 'center', padding: '2rem' }}>
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              Recluta más rápido con inteligencia artificial 🤖
            </motion.h2>
            <p>Sube tu CV y obtén un análisis al instante.</p>
          </section>
          <section style={{ maxWidth: 500, margin: '0 auto' }}>
            <input type="file" accept=".pdf" onChange={handleUpload} />
            {archivo && <p>Archivo seleccionado: {archivo.name}</p>}
            {analisis && (
              <div style={{ border: '1px solid #5D00A3', padding: '1rem', borderRadius: '12px', marginTop: '1rem' }}>
                <p><strong>Nombre:</strong> {analisis.nombre}</p>
                <p><strong>Puntaje IA:</strong> {analisis.puntaje}</p>
                <p><strong>Resumen:</strong> {analisis.resumen}</p>
                <p><strong>Skills:</strong> {analisis.skills?.join(', ')}</p>
                <p><strong>Recomendación:</strong> {analisis.recomendacion}</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
