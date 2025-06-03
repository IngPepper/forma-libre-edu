"use client";

import ContentPriceCard from "@/components/ContentPriceCard";
import ContentSection from "@/components/ContentSection";
import romboRojo from "@/public/assets/im16h_rombo_rojo.jpg";
import styles from "@/app/page.module.css";
import ScrollToTopOnNavigation from "@/components/ScrollToTopOnNavigation";
import CollapsibleSection from "@/components/CollapsibleSection";

export default function Planes() {
    return (
      <main className="wrapper">
          <ScrollToTopOnNavigation />
          <CollapsibleSection maxHeight={500}>
              <ContentSection
                  title="Precios y Beneficios"
                  image="/assets/im01h_acentos_rojos.jpg"
                  reverse
              >
                  <p className={styles.textColor}>
                      <b>¡Accede a todo Forma Libre desde solo $89 al mes! 🏷️✨</b><br /><br />
                      Descubre el plan perfecto para ti y desbloquea <b>planos exclusivos</b>, <b>recursos premium</b> y <b>herramientas únicas</b> para estudiantes, profesionistas y entusiastas de la arquitectura.<br /><br />
                      <b>Sin letras chiquitas:</b> descarga ilimitada, soporte personalizado y acceso inmediato.<br /><br />

                      <b>Planes disponibles:</b><br />
                      <span>🟢 <b>Individual</b> – $299 MXN pago único</span><br />
                      <span>Acceso completo a todos los recursos y descargas por una sola compra. Ideal para proyectos puntuales.</span><br /><br />

                      <span>💡 <b>Mensual</b> – $89 MXN/mes</span><br />
                      <span>Acceso ilimitado mes a mes. Perfecto para estudiantes y profesionales que requieren recursos constantemente.</span><br /><br />

                      <span>🏆 <b>Anual</b> – $900 MXN/año</span><br />
                      <span>Ahorra más y disfruta de todos los beneficios durante todo el año. ¡La opción favorita de nuestra comunidad!</span><br /><br />

                      Súmate a la comunidad que está transformando la arquitectura. <b>¡Aprovecha la promoción de este mes y empieza hoy! 🚀</b>
                  </p>
              </ContentSection>
          </CollapsibleSection>
          <ContentPriceCard
              image={romboRojo}
              title="Planes"
              details={<ul>
                  <li>Acceso ilimitado</li>
                  <li>Soporte premium</li>
                  <li>Descargas instantáneas</li>
              </ul>}
              onBuy={(type, price) => alert(`Compraste: ${type} por $${price}`)}/>
      </main>
    );
}