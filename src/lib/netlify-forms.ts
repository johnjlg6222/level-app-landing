/**
 * Submit a form to Netlify Forms.
 * In dev mode (localhost), simulates success and logs to console.
 */
export async function submitNetlifyForm(
  formName: string,
  data: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  const isDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isDev) {
    console.log(`[Netlify Forms DEV] "${formName}" submission:`, data);
    return { ok: true };
  }

  try {
    const body = new URLSearchParams({ 'form-name': formName, ...data }).toString();

    const response = await fetch('/__forms.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      return { ok: false, error: `Submission failed (${response.status})` };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}
