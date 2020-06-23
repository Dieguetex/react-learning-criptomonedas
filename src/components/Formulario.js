import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Error from "./Error";
import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";
import Axios from "axios";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`;

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {
  // State del listado de criptomonedas
  const [listaCripto, guardarCriptomonedas] = useState([]);
  const [error, guardarError] = useState(false);

  const MONEDAS = [
    {
      codigo: "USD",
      nombre: "Dolar de Estados Unidos",
    },
    { codigo: "MXN", nombre: "Peso Mexicano" },
    { codigo: "EUR", nombre: "Euro" },
    { codigo: "GBP", nombre: "Libra Esterlina" },
  ];

  // Custom hook useMoneda
  const [moneda, SelectMonedas] = useMoneda(
    "Selecciona tu Moneda",
    "",
    MONEDAS
  );
  // Custom hook useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomoneda(
    "Selecciona tu Criptomoneda",
    "",
    listaCripto
  );

  useEffect(() => {
    const consultaAPI = async () => {
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

      const resultado = await Axios.get(url);
      guardarCriptomonedas(resultado.data.Data);
    };
    consultaAPI();
  }, []);

  // El enviar el formulario
  const cotizarMoneda = (e) => {
    e.preventDefault();

    // Validar si ambos campos están llenos
    if (moneda === "" || criptomoneda === "") {
      guardarError(true);
      return;
    }
    // Pasar los datos al componente principal
    guardarError(false);
    guardarMoneda(moneda);
    guardarCriptomoneda(criptomoneda);
  };

  return (
    <form onSubmit={cotizarMoneda}>
      {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
      <SelectMonedas />
      <SelectCripto />
      <Boton type="submit" value="Calcular" />
    </form>
  );
};

export default Formulario;
