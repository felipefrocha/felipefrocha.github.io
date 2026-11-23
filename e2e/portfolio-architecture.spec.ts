import { test, expect } from '@playwright/test';

test.describe('Portfolio Architectural Discussions for AI & ProjectA Workbench', () => {
  test('renders Architectural Discussions for AI on /portfolio and navigates to /portfolio/project-a-architecture', async ({
    page,
  }) => {
    await page.goto('/portfolio');

    await expect(page.getByTestId('text-portfolio-title')).toBeVisible();
    await expect(page.getByTestId('section-portfolio-ai-architecture')).toBeVisible();
    await expect(page.getByTestId('section-portfolio-projects')).toBeVisible();

    const projectACard = page.getByTestId('card-project-project-a-ai-workbench');
    await expect(projectACard).toBeVisible();
    await expect(page.getByTestId('badge-project-category-project-a-ai-workbench')).toContainText(
      'Architectural Discussions for AI'
    );

    const internalLink = page.getByTestId('link-project-demo-project-a-ai-workbench');
    await expect(internalLink).not.toHaveAttribute('target', '_blank');
    await internalLink.click();

    await expect(page).toHaveURL(/\/portfolio\/project-a-architecture$/);
    await expect(page.getByTestId('text-project-a-title')).toContainText(
      'ProjectA: Dual-Tier Agentic AI Workbench Architecture'
    );
  });

  test('switches between animated 2D SVG Block & Flow tabs and UML Sequence Diagram with Auto-Play and comparison matrix in light and dark mode', async ({
    page,
  }) => {
    await page.goto('/portfolio/project-a-architecture');

    await expect(page.getByTestId('text-project-a-title')).toBeVisible();
    await expect(page.getByTestId('callout-complementary-tiers')).toContainText(
      'complementary deployment tiers'
    );

    // 5 Architectural Invariants
    for (let i = 1; i <= 5; i++) {
      await expect(page.getByTestId(`card-invariant-${i}`)).toBeVisible();
    }

    // Legend bar
    await expect(page.getByTestId('architecture-color-legend')).toBeVisible();

    // Default tab: Option A 2D SVG Block & Flow Diagram
    await expect(page.getByTestId('topology-panel-option-a')).toBeVisible();
    await expect(page.getByTestId('svg-topology-option-a')).toBeVisible();
    await expect(page.getByTestId('svg-edge-oa-5')).toBeVisible();
    await expect(page.getByTestId('flow-callout-option-a')).toBeVisible();

    // Flow playback & stepping controls
    await page.getByTestId('button-flow-next-option-a').click();
    await expect(page.getByTestId('text-flow-step-option-a')).toContainText('Flow 2 /');
    await page.getByTestId('button-flow-play-option-a').click();

    await page.getByTestId('diagram-node-CNPG').click();
    await expect(page.getByTestId('diagram-inspector-option-a')).toContainText(
      'Dedicated CNPG Postgres + pgvector'
    );

    // Switch to Control Plane & GitOps
    await page.getByTestId('tab-control-plane').click();
    await expect(page.getByTestId('topology-panel-control-plane')).toBeVisible();
    await expect(page.getByTestId('svg-topology-control-plane')).toBeVisible();
    await expect(page.getByTestId('svg-edge-cp-9')).toBeVisible();
    await page.getByTestId('diagram-node-Legal').click();
    await expect(page.getByTestId('diagram-inspector-control-plane')).toContainText('Legal API');

    // Switch to Option B: Agile Namespace
    await page.getByTestId('tab-option-b').click();
    await expect(page.getByTestId('topology-panel-option-b')).toBeVisible();
    await expect(page.getByTestId('svg-topology-option-b')).toBeVisible();
    await expect(page.getByTestId('svg-edge-ob-15')).toBeVisible();
    await page.getByTestId('diagram-node-SharedPhoenix').click();
    await expect(page.getByTestId('diagram-inspector-option-b')).toContainText(
      'Shared Arize Phoenix'
    );

    // Switch to 24-Step Standard UML Sequence Diagram
    await page.getByTestId('tab-sequence').click();
    await expect(page.getByTestId('topology-panel-sequence')).toBeVisible();
    await expect(page.getByTestId('uml-fragment-loop')).toBeVisible();
    await expect(page.getByTestId('uml-fragment-opt')).toBeVisible();
    await expect(page.getByTestId('sequence-step-13')).toBeVisible();
    await expect(page.getByTestId('sequence-step-24')).toBeVisible();

    // Test Auto-Play & Speed toggle
    await page.getByTestId('button-seq-speed').click();
    await expect(page.getByTestId('button-seq-speed')).toContainText('2x');
    await page.getByTestId('button-seq-autoplay').click();
    await expect(page.getByTestId('button-seq-autoplay')).toContainText('Pause');
    await page.waitForTimeout(1050);
    await expect(page.getByTestId('text-seq-step-counter')).not.toHaveText('Step 13 / 24');
    await page.getByTestId('button-seq-autoplay').click();

    // Manual stepping & phase filter
    await page.getByTestId('sequence-step-13').click();
    await expect(page.getByTestId('text-seq-step-counter')).toHaveText('Step 13 / 24');
    await page.getByTestId('button-seq-next').click();
    await expect(page.getByTestId('text-seq-step-counter')).toHaveText('Step 14 / 24');
    await expect(page.getByTestId('sequence-step-inspector')).toContainText(
      'short-lived delegated JWT'
    );

    await page.getByTestId('button-phase-oidc-dispatch').click();
    await expect(page.getByTestId('text-seq-step-counter')).toHaveText('Step 1 / 24');

    // Comparison Matrix (11 dimensions)
    const matrix = page.getByTestId('comparison-matrix-region');
    await matrix.scrollIntoViewIfNeeded();
    await expect(matrix).toBeVisible();
    await expect(matrix).toHaveAttribute('tabindex', '0');
    await expect(matrix.locator('tbody tr')).toHaveCount(11);

    // Verify theme toggle works cleanly on this route
    const html = page.locator('html');
    const wasDark = await html.evaluate((el) => el.classList.contains('dark'));
    await page.getByTestId('button-theme-toggle').click();
    const isDarkAfter = await html.evaluate((el) => el.classList.contains('dark'));
    expect(isDarkAfter).toBe(!wasDark);
  });
});
