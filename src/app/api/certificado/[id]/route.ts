import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function centerText(page: any, font: any, size: number, text: string, y: number, color: any) {
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = (page.getWidth() - textWidth) / 2;
    page.drawText(text, { x, y, size, font, color });
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

        const azul = rgb(0.12, 0.23, 0.37);
        const gris = rgb(0.33, 0.33, 0.33);
        const grisClaro = rgb(0.53, 0.53, 0.53);
        const negro = rgb(0, 0, 0);

        page.drawRectangle({ x: 25, y: 25, width: width - 50, height: height - 50, borderColor: azul, borderWidth: 3 });
        page.drawRectangle({ x: 30, y: 30, width: width - 60, height: height - 60, borderColor: azul, borderWidth: 1 });
        page.drawRectangle({ x: 35, y: 35, width: width - 70, height: height - 70, borderColor: rgb(0.75, 0.75, 0.75), borderWidth: 0.5 });

        let y = 90;

        centerText(page, fontBold, 22, "UNIVERSIDAD DE CIENCIAS INFORMÁTICAS", y, azul);
        y -= 25;
        centerText(page, font, 13, "La Habana, Cuba", y, gris);
        y -= 35;

        page.drawLine({ start: { x: 180, y }, end: { x: width - 180, y }, color: azul, thickness: 1 });
        y -= 40;

        centerText(page, fontBold, 18, "CERTIFICADO DE NIVEL DE IDIOMA INGLÉS", y, azul);
        y -= 65;

        centerText(page, font, 12, "Por medio de la presente, se certifica que:", y, negro);
        y -= 35;

        const nombreCompleto = [usuario.firstName, usuario.lastName].filter(Boolean).join(" ");
        centerText(page, fontBold, 22, nombreCompleto || usuario.username, y, negro);
        y -= 28;

        centerText(page, font, 11, `Username: ${usuario.username}`, y, grisClaro);
        y -= 18;

        if (usuario.carrera) {
            centerText(page, font, 11, `Carrera: ${usuario.carrera}`, y, grisClaro);
            y -= 18;
        }
        if (usuario.facultad) {
            centerText(page, font, 11, `Facultad: ${usuario.facultad}`, y, grisClaro);
            y -= 18;
        }

        y -= 25;
        centerText(page, font, 12, "Ha alcanzado el nivel de competencia lingüística en idioma inglés:", y, negro);
        y -= 35;

        centerText(page, fontBold, 28, usuario.nivel || "—", y, azul);
        y -= 25;

        centerText(page, font, 11, "Según el Marco Común Europeo de Referencia para las Lenguas (MCER)", y, grisClaro);
        y -= 55;

        page.drawLine({ start: { x: 200, y }, end: { x: width - 200, y }, color: rgb(0.8, 0.8, 0.8), thickness: 0.5 });
        y -= 50;

        const fechaActual = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        centerText(page, font, 11, `Emitido en La Habana, el ${fechaActual}`, y, grisClaro);
        y -= 65;

        centerText(page, font, 10, "_________________________________", y, negro);
        y -= 18;
        centerText(page, fontBold, 11, "Dirección de Idiomas", y, azul);
        y -= 15;
        centerText(page, font, 9, "Universidad de Ciencias Informáticas", y, grisClaro);

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
