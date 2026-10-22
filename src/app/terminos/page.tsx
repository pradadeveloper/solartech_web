import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { DraftNotice } from "@/components/sections/draft-notice";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { legal } from "@/content/legal";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Términos y condiciones de uso",
  description: "Términos y condiciones de uso del sitio web de Solartech, el cotizador de energía solar y el carácter referencial de las pre-cotizaciones.",
  path: "/terminos/",
  noindex: legal.isDraft,
});

export default function TerminosPage() {
  return (
    <>
      <PageHeader
        title="Términos y condiciones de uso"
        description={`Última actualización: ${legal.lastUpdated}`}
        crumbs={[{ name: "Términos y condiciones", path: "/terminos/" }]}
      />
      <Container className="py-16 lg:py-20">
        {legal.isDraft && <DraftNotice />}
        <Prose className="mt-8">
          <p>
            Estos términos regulan el uso del sitio web {site.url.replace("https://", "")} (el &ldquo;sitio&rdquo;), operado por {legal.companyName}, NIT {legal.nit}, bajo la
            marca {site.name}. Al navegar el sitio o usar sus herramientas aceptas estas condiciones.
          </p>

          <h2>1. Uso del sitio</h2>
          <p>
            El sitio tiene fines informativos y comerciales sobre proyectos de energía solar. Te comprometes a usarlo de forma lícita, a suministrar información veraz en los
            formularios y a no realizar acciones que afecten su funcionamiento o seguridad.
          </p>

          <h2>2. Carácter referencial de las pre-cotizaciones</h2>
          <p>
            El cotizador calcula estimaciones a partir de la información que ingresas y de parámetros promedio (radiación solar, tarifas de energía, costos de referencia y
            normatividad vigente). <strong>Pre-cotización referencial. La propuesta final requiere visita técnica y análisis de factura.</strong>
          </p>
          <p>
            Los valores de inversión, ahorro, retorno y beneficio tributario mostrados no constituyen una oferta comercial vinculante ni asesoría financiera o tributaria. Los
            beneficios de la Ley 1715 de 2014 dependen de la situación particular de cada contribuyente y de la certificación de la UPME; consulta a tu asesor tributario.
          </p>

          <h2>3. Propiedad intelectual</h2>
          <p>
            Los textos, fotografías de proyectos, logotipos, gráficos y software del sitio son propiedad de Solartech o de sus licenciantes y están protegidos por las normas de
            propiedad intelectual. Las marcas de aliados y fabricantes pertenecen a sus respectivos titulares. No está permitida su reproducción sin autorización previa y
            por escrito.
          </p>

          <h2>4. Enlaces a terceros</h2>
          <p>
            El sitio contiene enlaces a sitios de terceros, como la tienda de equipos de Ferragro, entidades financieras y redes sociales. Solartech no es responsable por el
            contenido ni por las políticas de esos sitios. La venta de equipos se rige por los términos de{" "}
            <a href={site.equipmentStore} target="_blank" rel="noopener noreferrer">
              la tienda de Ferragro
            </a>
            .
          </p>

          <h2>5. Datos personales</h2>
          <p>
            El tratamiento de la información que suministras se rige por nuestra <Link href="/politica-de-privacidad/">política de tratamiento de datos personales</Link>.
          </p>

          <h2>6. Responsabilidad</h2>
          <p>
            Solartech procura que la información del sitio sea exacta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad permanente del sitio.
            Las decisiones de inversión deben tomarse con base en la propuesta técnica y económica formal.
          </p>

          <h2>7. Modificaciones</h2>
          <p>Solartech puede modificar estos términos en cualquier momento. Los cambios rigen desde su publicación en el sitio.</p>

          <h2>8. Ley aplicable</h2>
          <p>Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se someterá a los jueces competentes de Colombia.</p>
        </Prose>
      </Container>
    </>
  );
}
