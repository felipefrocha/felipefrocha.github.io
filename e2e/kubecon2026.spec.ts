import { test, expect } from '@playwright/test';

test.describe('KubeCon NA 2026 Interactive Research & 35-Step Presentation Deck', () => {
  test('renders scroll research report with all shifts, diagrams, visualizations, folder matrix, and interactive popovers', async ({
    page,
  }) => {
    await page.goto('/kubecon-2026');

    // Hero & 30-Tick Sorting Field
    await expect(page.getByTestId('text-kubecon-title')).toContainText(
      'AI moved onto Kubernetes. Then it outgrew the pod.'
    );
    const tickField = page.getByTestId('hero-tick-field');
    await expect(tickField).toBeVisible();
    await expect(tickField.locator('i[data-tick-index]')).toHaveCount(30);

    // 5-Node Pyramid Decision Tree
    const tree = page.getByTestId('pyramid-decision-tree');
    await expect(tree).toBeVisible();
    for (const slug of ['scheduling', 'trust', 'cost', 'recovery', 'standards']) {
      await expect(page.getByTestId(`tree-node-${slug}`)).toBeVisible();
    }

    // All 7 Inline Visualizations present across Why Now + 4 Shifts + Bridge
    await expect(page.getByTestId('viz-waffle100')).toBeVisible();
    await expect(page.getByTestId('viz-version')).toBeVisible();
    await expect(page.getByTestId('viz-switch')).toBeVisible();
    await expect(page.getByTestId('viz-range').first()).toBeVisible();
    await expect(page.getByTestId('viz-bars')).toBeVisible();
    await expect(page.getByTestId('viz-stream')).toBeVisible();
    await expect(page.getByTestId('viz-ticks')).toBeVisible();

    // From / To Diff Cards for all 4 shifts and Standards bridge
    for (const slug of ['scheduling', 'trust', 'cost', 'recovery', 'standards']) {
      await expect(page.getByTestId(`diff-card-${slug}`)).toBeVisible();
    }

    // Interactive Source Popover (Shadcn Popover)
    const firstSourceChip = page.locator('button[data-src]').first();
    await firstSourceChip.scrollIntoViewIfNeeded();
    await firstSourceChip.click();
    await expect(page.getByText(/See source \[\d+\]/).first()).toBeVisible();

    // Monday Playbook interactive checklist
    const firstMoveCheckbox = page.getByTestId('checkbox-move-1');
    await firstMoveCheckbox.scrollIntoViewIfNeeded();
    await firstMoveCheckbox.click();
    await expect(firstMoveCheckbox).toHaveAttribute('data-state', 'checked');

    // Confidence 5-segment Reconcile Bar
    await expect(page.getByTestId('reconcile-report-bar')).toBeVisible();

    // 30-Session Folder Matrix Map filtering & detail inspector
    const matrix = page.getByTestId('folder-matrix');
    await matrix.scrollIntoViewIfNeeded();
    await expect(matrix).toBeVisible();

    const trustFilter = page.getByTestId('filter-shift-trust');
    await trustFilter.click();
    await expect(trustFilter).toHaveAttribute('aria-pressed', 'true');

    const allFilter = page.getByTestId('filter-shift-all');
    await allFilter.click();

    const folderChip = page.getByTestId('folder-chip-how-anthropic-almost-melted-gke');
    await folderChip.click();
    await expect(
      page.getByTestId('folder-detail-content').first()
    ).toContainText('How Anthropic almost melted GKE');
  });

  test('runs the self-contained 35-step presentation engine with diff beats, presenter notes, blackout, and keyboard controls', async ({
    page,
  }) => {
    await page.goto('/kubecon-2026');
    await expect(page.getByTestId('text-kubecon-title')).toBeVisible();

    // Verify window.kcSlides exposes all 35 steps across 13 slides
    const slideSteps = await page.evaluate(() => window.kcSlides?.() || []);
    expect(slideSteps.length).toBe(35);

    // Enter presentation mode from Hero CTA
    await page.getByTestId('button-hero-present').click();
    const stage = page.getByTestId('kubecon-presentation-stage');
    await expect(stage).toBeVisible();
    await expect(page.getByTestId('stage-step-count')).toHaveText('1 / 35');

    // Ensure ticks are sorted first, then advance to Step 2 (Guess poll)
    const isSorted = await stage
      .getByTestId('hero-tick-field')
      .getAttribute('data-sorted');
    if (isSorted !== 'true') {
      await page.keyboard.press('ArrowRight');
    }
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('stage-step-count')).toHaveText('2 / 35');
    await expect(stage).toHaveAttribute('data-slide', 'guess');

    // Step 3: Guess reveal with 458-cell Waffle chart
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('stage-step-count')).toHaveText('3 / 35');
    await expect(stage.getByTestId('viz-waffle458')).toBeVisible();

    // Jump directly to Step 9 (Scheduling Step 2: Title + From/To diff beat) via numeric shortcut "9" + "Enter"
    await page.keyboard.press('9');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('stage-step-count')).toHaveText('9 / 35');
    await expect(stage).toHaveAttribute('data-slide', 'trend-scheduling');
    await expect(stage.getByTestId('stage-diff-to')).toBeVisible();

    // Toggle Presenter Notes (N)
    await page.keyboard.press('n');
    const notesPanel = page.getByTestId('presenter-notes-panel');
    await expect(notesPanel).toBeVisible();
    await expect(notesPanel).toContainText('Step 9');

    // Toggle Blackout (B) and dismiss
    await page.keyboard.press('b');
    await expect(page.getByTestId('stage-blackout')).toBeVisible();
    await page.keyboard.press(' ');
    await expect(page.getByTestId('stage-blackout')).toHaveCount(0);

    // Exit presentation mode (Escape)
    await page.keyboard.press('Escape');
    await expect(stage).toHaveCount(0);
  });

  test('links from blog post and companion presentation route to /kubecon-2026', async ({
    page,
  }) => {
    await page.goto('/blog/kubecon-2026-na');
    await expect(page.getByTestId('text-post-title')).toContainText(
      'AI Moved Onto Kubernetes'
    );

    await page.goto('/presentations/kubecon-2026');
    await expect(
      page.getByRole('heading', {
        name: /AI moved onto Kubernetes\. Then it outgrew the pod\./i,
      })
    ).toBeVisible();
  });
});
