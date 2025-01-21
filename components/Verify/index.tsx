"use client";
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

// Función para verificar la prueba (debes implementarla en el servidor)
const verifyProof = async (proof) => {
  // Llamada al servidor para verificar el proof
  try {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proof,
        action: "testing-accion",
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la verificación del proof");
    }

    const result = await response.json();
    if (result.verified) {
      console.log("Prueba verificada con éxito");
      return result;
    } else {
      throw new Error("La verificación falló");
    }
  } catch (error) {
    console.error("Error verificando el proof:", error);
    throw error;
  }
};

// Función que se llama después de la verificación exitosa
const onSuccess = () => {
  console.log("¡Verificación exitosa!");
  // Aquí puedes agregar más lógica, como redirigir o mostrar un mensaje
};

export const WorldcoinVerify = () => {
  return (
    <IDKitWidget
      app_id="app_2248679d8f07eb1b7eacd922f9a26a1e" // Tu ID de aplicación
      action="testing-accion" // Acción que estás realizando
      verification_level={VerificationLevel.Device} // Verificación de dispositivo
      handleVerify={verifyProof} // Manejar la verificación del proof
      onSuccess={onSuccess} // Acción después de la verificación exitosa
    >
      {({ open }) => (
        <button onClick={open}>
          Verificar con World ID
        </button>
      )}
    </IDKitWidget>
  );
};
