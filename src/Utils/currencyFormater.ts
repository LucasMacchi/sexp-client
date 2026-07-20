

export function currencyFormatter(value: string) {
    if (!value) return '';
    const parsed = parseFloat(value.replace(/[^\d]/g, ''));
    if (isNaN(parsed)) return '';
    return new Intl.NumberFormat('es-AR',{
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2
    }).format(parsed)
}

export function currencyFormatterInput(value: string) {
    if (!value) return '';
    const parsed = parseFloat(value.replace(/[^\d]/g, ''));
    if (isNaN(parsed)) return '';
    return new Intl.NumberFormat('es-AR',{
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2
    }).format( parsed / 100)
}

export function deFormatterCurrency (value: string) {
    if (!value) return 0;

    // Elimina todo excepto dígitos y separadores
    const cleaned = value
    .replace(/[^\d,.-]/g, '') // elimina símbolos, letras, espacios
    .replace(/\./g, '')       // elimina separadores de miles
    .replace(',', '.');       // convierte coma decimal a punto
    return parseFloat(cleaned)
}