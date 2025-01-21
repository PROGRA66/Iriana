"utilizar cliente";
importar {
  MiniKit,
  tokenADecimales,
  Fichas,
  Entrada de comando de pago,
} de "@worldcoin/minikit-js";
importar { useState } de "react";

// Función para realizar el pago
const sendPayment = async (wldAmount: número, usdcAmount: número) => {
  intentar {
    const res = await fetch(`/api/inicia-pago`, {
      método: "POST",
    });

    const { id } = esperar res.json();

    carga útil constante: PayCommandInput = {
      referencia: id,
      to: "0xde6b6e1cddbfd1d94afc01957748c36c36f43af4", // Dirección de prueba
      fichas: [
        {
          símbolo: Tokens.WLD,
          token_amount: tokenToDecimals(wldAmount, Tokens.WLD).toString(),
        },
        {
          símbolo: Tokens.USDCE,
          token_amount: tokenToDecimals(usdcAmount, Tokens.USDCE).toString(),
        },
      ],
      Descripción: "Transacción de pago de prueba",
    };

    si (MiniKit.isInstalled()) {
      devolver esperar MiniKit.commandsAsync.pay(payload);
    }
    devuelve nulo;
  } captura (error: desconocido) {
    console.error("Error al enviar el pago", error);
    devuelve nulo;
  }
};

// Función para manejar el proceso completo de pago
const handlePay = async (wldAmount: número, usdcAmount: número) => {
  si (!MiniKit.isInstalled()) {
    console.error("MiniKit no está instalado");
    devolver;
  }

  const sendPaymentResponse = await sendPayment(montowld, montousdc);
  const respuesta = sendPaymentResponse?.finalPayload;
  si (!respuesta) {
    console.error("Pago fallido");
    devolver;
  }

  si (respuesta.estado === "éxito") {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/confirm-payment`, {
      método: "POST",
      encabezados: { "Content-Type": "application/json" },
      cuerpo: JSON.stringify({ payload: respuesta }),
    });

    const pago = await res.json();
    si (pago.éxito) {
      console.log("¡Pago EXITOSO!");
    } demás {
      console.error("¡Pago FALLÓ!");
    }
  }
};

// Componente de pago
exportar const PayBlock = () => {
  const [wldAmount, setWldAmount] = useState<número>(0.5);
  const [usdcAmount, setUsdcAmount] = useState<número>(0.1);

  devolver (
    <div className="flex flex-col items-center p-4 bg-gray-100 sombra redondeada-md">
      <h2 className="text-xl font-bold mb-4">Formulario de pago</h2>
      <div className="mb-4">
        <label htmlFor="wldAmount" className="bloque texto-pequeño fuente-media texto-gris-700">
          Monto WLD:
        </etiqueta>
        <entrada
          tipo="numero"
          id="cantidadwld"
          valor={wldCantidad}
          onChange={(e) => setWldAmount(Number(e.target.value) || 0)}
          mín="0"
          className="mt-1 p-2 borde borde-gris-300 redondeado w-64"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="usdcAmount" className="bloque texto-sm fuente-media texto-gris-700">
          Monto USDCE:
        </etiqueta>
        <entrada
          tipo="numero"
          id="cantidad en dólares estadounidenses"
          valor={cantidadusdc}
          onChange={(e) => setUsdcAmount(Number(e.target.value) || 0)}
          mín="0"
          className="mt-1 p-2 borde borde-gris-300 redondeado w-64"
        />
      </div>
      <botón
        onClick={() => handlePay(montowld, montousdc)}
        className="bg-blue-500 texto-blanco fuente-negrita py-2 px-4 redondeado pasar el mouse sobre:bg-blue-600"
      >
        Pagar
      </botón>
    </div>
  );
};
