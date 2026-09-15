import bg from "../../assets/auth-bg.svg";

/**
 * Arte poligonal do fundo das telas de autenticação.
 *
 * Redesenhada em SVG a partir do design: no PDF a arte é vetorial, mas o
 * pdftocairo não consegue extraí-la (glifos Type 3 vazios quebram o SVG) e o
 * raster embutido é só o brilho suave — o recorte trazia o logo junto. Como
 * são polígonos chapados, redesenhar saiu mais fiel, escala em qualquer tela
 * e pesa 1 KB.
 */
export default function AuthBackdrop() {
  return (
    <div
      className="auth-layout__backdrop"
      aria-hidden="true"
      style={{ ["--auth-bg-image" as string]: `url(${bg})` }}
    />
  );
}
