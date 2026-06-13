import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function centerText(page: any, font: any, size: number, text: string, y: number, color: any) {
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = (page.getWidth() - textWidth) / 2;
    page.drawText(text, { x, y, size, font, color });
}

function drawCorner(page: any, x: number, y: number, size: number, color: any) {
    page.drawLine({ start: { x, y: y + size }, end: { x: x + size * 2, y: y + size }, color, thickness: 1.5 });
    page.drawLine({ start: { x: x + size, y }, end: { x: x + size, y: y + size * 2 }, color, thickness: 1.5 });
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const usuario = await prisma.usuario.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                nivel: true,
                certificado: true,
                carrera: true,
                facultad: true,
            },
        });

        if (!usuario) {
            return NextResponse.json(
                { success: false, message: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        if (!usuario.certificado) {
            return NextResponse.json(
                { success: false, message: "El usuario no está certificado" },
                { status: 400 }
            );
        }

        const doc = await PDFDocument.create();
        const page = doc.addPage([792, 612]);
        const { width, height } = page.getSize();

        const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

        const azul = rgb(0.1, 0.2, 0.35);
        const azulClaro = rgb(0.2, 0.35, 0.55);
        const dorado = rgb(0.79, 0.66, 0.3);
        const grisOscuro = rgb(0.25, 0.25, 0.25);
        const gris = rgb(0.45, 0.45, 0.45);
        const grisClaro = rgb(0.55, 0.55, 0.55);

        const m = 35;

        page.drawRectangle({ x: m, y: m, width: width - m * 2, height: height - m * 2, borderColor: azul, borderWidth: 2.5 });
        page.drawRectangle({ x: m + 4, y: m + 4, width: width - m * 2 - 8, height: height - m * 2 - 8, borderColor: dorado, borderWidth: 1 });
        page.drawRectangle({ x: m + 8, y: m + 8, width: width - m * 2 - 16, height: height - m * 2 - 16, borderColor: azulClaro, borderWidth: 0.5 });

        drawCorner(page, m + 12, m + 12, 10, dorado);
        drawCorner(page, width - m - 12 - 20, m + 12, 10, dorado);
        drawCorner(page, m + 12, height - m - 12 - 20, 10, dorado);
        drawCorner(page, width - m - 12 - 20, height - m - 12 - 20, 10, dorado);

        let y = height - 60;

        centerText(page, fontBold, 20, "UNIVERSIDAD DE CIENCIAS INFORMÁTICAS", y, azul);
        y -= 20;
        centerText(page, font, 10, "LA HABANA · CUBA", y, gris);
        y -= 30;

        page.drawLine({ start: { x: width / 2 - 60, y: y }, end: { x: width / 2 + 60, y }, color: dorado, thickness: 1.5 });
        y -= 35;

        centerText(page, fontBold, 14, "CERTIFICA", y, azulClaro);
        y -= 35;

        centerText(page, font, 11, "Por medio de la presente, se hace constar que el estudiante:", y, grisOscuro);
        y -= 30;

        const nombreCompleto = [usuario.firstName, usuario.lastName].filter(Boolean).join(" ");
        centerText(page, fontBold, 22, nombreCompleto || usuario.username, y, azul);
        y -= 25;
        centerText(page, font, 10, `Username: ${usuario.username}`, y, gris);
        y -= 18;

        if (usuario.carrera || usuario.facultad) {
            const linea = [usuario.carrera, usuario.facultad].filter(Boolean).join(" — ");
            centerText(page, font, 10, linea, y, gris);
            y -= 18;
        }

        y -= 22;

        centerText(page, font, 11, "Ha completado satisfactoriamente el programa de idioma inglés y ha alcanzado", y, grisOscuro);
        y -= 16;
        centerText(page, font, 11, "el nivel de competencia lingüística siguiente, según el", y, grisOscuro);
        y -= 16;
        centerText(page, fontOblique, 10, "Marco Común Europeo de Referencia para las Lenguas (MCER):", y, gris);
        y -= 30;

        page.drawLine({ start: { x: width / 2 - 50, y }, end: { x: width / 2 + 50, y }, color: dorado, thickness: 0.5 });
        y -= 30;

        centerText(page, fontBold, 32, usuario.nivel || "—", y, azul);
        y -= 22;
        centerText(page, font, 10, `Nivel ${usuario.nivel} de competencia lingüística`, y, grisClaro);

        y -= 30;
        page.drawLine({ start: { x: width / 2 - 50, y }, end: { x: width / 2 + 50, y }, color: dorado, thickness: 0.5 });
        y -= 40;

        const fechaActual = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        centerText(page, font, 10, `Dado en La Habana, a ${fechaActual}`, y, gris);
        y -= 40;

        centerText(page, font, 10, "_________________________________________", y, azul);
        y -= 15;
        centerText(page, fontBold, 11, "Dirección de Idiomas", y, azul);
        y -= 13;
        centerText(page, font, 8, "Universidad de Ciencias Informáticas", y, grisClaro);

        centerText(page, font, 7, `Certificado emitido electrónicamente · Registro UCI-${String(usuario.id).padStart(6, "0")}-${new Date().getFullYear()}`, m + 10, grisClaro);

        const pdfBytes = await doc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="certificado_${usuario.username}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generando certificado:", error);
        return NextResponse.json(
            { success: false, message: "Error al generar el certificado" },
            { status: 500 }
        );
    }
}
