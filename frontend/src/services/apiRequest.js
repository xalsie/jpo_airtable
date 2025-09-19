export async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const result = await response.json().catch(() => null);

        if (response.ok) {
            return {
                success: true,
                status: response.status,
                data: result,
            };
        } else {
            return {
                success: false,
                status: response.status,
                message: result?.message || "Erreur serveur",
                data: result,
            };
        }
    } catch (e) {
        return { success: false, message: "Erreur réseau" };
    }
}
