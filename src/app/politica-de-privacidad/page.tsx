import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { DraftNotice } from "@/components/sections/draft-notice";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { legal, POLICY_VERSION } from "@/content/legal";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de tratamiento de datos personales",
  description: "Política de tratamiento de datos personales de Solartech conforme a la Ley 1581 de 2012: finalidades, derechos del titular y cómo ejercerlos.",
  path: "/politica-de-privacidad/",
  noindex: legal.isDraft,
});

export default function PoliticaPrivacidadPage() {
  const { contact } = site;
  return (
    <>
      <PageHeader
        title="Política de tratamiento de datos personales"
        description={`Última actualización: ${legal.lastUpdated} · Versión ${POLICY_VERSION}`}
        crumbs={[{ name: "Política de privacidad", path: "/politica-de-privacidad/" }]}
      />
      <Container className="py-16 lg:py-20">
        {legal.isDraft && <DraftNotice />}
        <Prose className="mt-8">
          <p>
            En cumplimiento de la Ley Estatutaria 1581 de 2012 y del Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015), {legal.companyName}, que opera la marca{" "}
            {site.name} (en adelante, &ldquo;Solartech&rdquo;), adopta la presente política para el tratamiento de los datos personales que recolecta a través del sitio web{" "}
            {site.url.replace("https://", "")} y de sus canales de atención.
          </p>

          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>
              <strong>Razón social:</strong> {legal.companyName}
            </li>
            <li>
              <strong>NIT:</strong> {legal.nit}
            </li>
            <li>
              <strong>Domicilio:</strong> {contact.address.street}, {contact.address.city}, {contact.address.region}, Colombia
            </li>
            <li>
              <strong>Correo para consultas y reclamos:</strong> {legal.habeasDataEmail}
            </li>
            <li>
              <strong>Teléfono:</strong> {contact.phoneDisplay}
            </li>
          </ul>

          <h2>2. Datos que recolectamos</h2>
          <p>Cuando usas el cotizador, el formulario de contacto o nuestros canales de atención, podemos recolectar:</p>
          <ul>
            <li>Datos de identificación y contacto: nombre, empresa, NIT, correo electrónico y número de celular o WhatsApp.</li>
            <li>Datos del proyecto: ciudad y departamento, tipo de cliente, valor de la factura, consumo de energía, tarifa, tipo de techo o terreno y área disponible.</li>
            <li>La factura de energía que decidas adjuntar, la cual puede contener la dirección del inmueble y datos de consumo.</li>
            <li>Datos de navegación: páginas visitadas, origen de la visita (parámetros UTM y de campañas) y datos técnicos del dispositivo, según tus preferencias de cookies.</li>
          </ul>
          <p>
            Solartech <strong>no solicita datos sensibles</strong> en los términos del artículo 5 de la Ley 1581 de 2012. Si una factura adjunta contiene información que no
            es necesaria para la cotización, no será utilizada para ninguna otra finalidad.
          </p>

          <h2>3. Finalidades del tratamiento</h2>
          <ul>
            <li>Atender tus solicitudes de cotización y elaborar pre-cotizaciones y propuestas técnicas y económicas.</li>
            <li>Contactarte por teléfono, WhatsApp o correo electrónico para dar seguimiento a tu solicitud y agendar visitas técnicas.</li>
            <li>Enviarte la propuesta, documentos del proyecto y comunicaciones relacionadas con los servicios contratados.</li>
            <li>Enviarte información comercial sobre productos y servicios de energía solar de Solartech y del grupo Ferragro, si lo autorizas.</li>
            <li>Analizar el uso del sitio web y medir la efectividad de nuestras campañas, conforme a tus preferencias de cookies.</li>
            <li>Cumplir obligaciones legales, contractuales y de atención de requerimientos de autoridades.</li>
          </ul>

          <h2>4. Derechos del titular</h2>
          <p>Como titular de los datos tienes derecho a:</p>
          <ul>
            <li>Conocer, actualizar y rectificar tus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada a Solartech.</li>
            <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley, una vez agotado el trámite ante Solartech.</li>
            <li>Revocar la autorización y solicitar la supresión de tus datos cuando no exista un deber legal o contractual de conservarlos.</li>
            <li>Acceder de forma gratuita a tus datos personales objeto de tratamiento.</li>
          </ul>

          <h2>5. Consultas y reclamos</h2>
          <p>
            Puedes ejercer tus derechos escribiendo a <strong>{legal.habeasDataEmail}</strong>, indicando tu nombre, documento de identificación, la descripción de tu
            solicitud y un medio de respuesta.
          </p>
          <ul>
            <li>
              <strong>Consultas:</strong> se responden en un máximo de diez (10) días hábiles desde su recibo. Si no es posible, te informaremos el motivo y la nueva fecha,
              que no superará cinco (5) días hábiles adicionales.
            </li>
            <li>
              <strong>Reclamos</strong> (corrección, actualización, supresión o incumplimiento): se atienden en un máximo de quince (15) días hábiles desde el día siguiente a
              su recibo, prorrogables hasta ocho (8) días hábiles adicionales informándote el motivo.
            </li>
          </ul>

          <h2>6. Transmisión y transferencia de datos</h2>
          <p>
            Para operar el sitio y atender tus solicitudes, Solartech puede transmitir datos a proveedores que actúan como encargados del tratamiento, bajo acuerdos que
            garantizan su seguridad y confidencialidad. Algunos de ellos almacenan la información fuera de Colombia:
          </p>
          <ul>
            <li>Vercel Inc. (alojamiento del sitio web).</li>
            <li>Supabase Inc. (base de datos y almacenamiento de facturas adjuntas).</li>
            <li>Google LLC (Google Analytics y Google Tag Manager, según tus preferencias de cookies).</li>
            <li>Proveedores de correo electrónico transaccional y mensajería para enviarte tu pre-cotización.</li>
          </ul>
          <p>Tus datos también pueden compartirse con empresas del grupo Ferragro para las finalidades descritas en esta política.</p>

          <h2>7. Cookies</h2>
          <p>
            El sitio usa cookies técnicas necesarias para su funcionamiento y, solo con tu autorización, cookies de analítica (medición de uso) y de marketing (publicidad en
            Google y Meta). Puedes aceptarlas, rechazarlas o configurarlas en el aviso de cookies; rechazarlas no afecta tu navegación. Si cambias de opinión, puedes borrar
            las cookies de tu navegador para que el aviso vuelva a aparecer.
          </p>

          <h2>8. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas, humanas y administrativas para proteger tus datos contra pérdida, consulta, uso o acceso no autorizado. Las facturas adjuntas se guardan
            en un almacenamiento privado al que solo accede el equipo comercial autorizado.
          </p>

          <h2>9. Vigencia</h2>
          <p>
            Esta política rige desde su publicación. Los datos se conservarán mientras sean necesarios para las finalidades descritas o mientras exista un deber legal o
            contractual de conservarlos. Cualquier cambio sustancial será informado en este sitio.
          </p>
          <p>
            Consulta también los <Link href="/terminos/">términos y condiciones de uso</Link> del sitio.
          </p>
        </Prose>
      </Container>
    </>
  );
}
