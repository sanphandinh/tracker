import type { Meta, StoryObj } from '@storybook/react'
import { ContentRegion, TwoPaneLayout } from '../tracker/content-region'

const meta = {
  title: 'Tracker/ContentRegion',
  component: ContentRegion,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContentRegion>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Single column layout (default mobile view)
 * Shows standard single-column content flow
 */
export const SingleColumn: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold mb-2">Card 1</h3>
          <p className="text-sm text-muted-foreground">Content in single column layout</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold mb-2">Card 2</h3>
          <p className="text-sm text-muted-foreground">All cards stack vertically on mobile</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold mb-2">Card 3</h3>
          <p className="text-sm text-muted-foreground">No horizontal scroll at ≥320px</p>
        </div>
      </div>
    ),
  },
}

/**
 * Two-pane layout (tablet and above)
 * Shows list + detail side-by-side at ≥768px
 */
export const TwoPane: Story = {
  render: () => (
    <div className="h-screen w-full">
      <ContentRegion
        listPane={
          <div className="p-4 space-y-2">
            <h3 className="font-semibold mb-4">List Pane</h3>
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="p-3 bg-card rounded border border-border hover:bg-accent cursor-pointer transition-colors"
              >
                <p className="font-medium">Item {i + 1}</p>
                <p className="text-xs text-muted-foreground">Click to view details</p>
              </div>
            ))}
          </div>
        }
        detailPane={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Detail Pane</h2>
            <p className="text-muted-foreground mb-4">
              This pane shows detailed information for the selected item from the list.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Section 1</h4>
                <p className="text-sm">Detailed content goes here...</p>
              </div>
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Section 2</h4>
                <p className="text-sm">More detailed content...</p>
              </div>
            </div>
          </div>
        }
      />
    </div>
  ),
}

/**
 * TwoPaneLayout helper component
 * Convenient wrapper for list + detail patterns
 */
export const UsingTwoPaneLayout: Story = {
  render: () => (
    <div className="h-screen w-full">
      <TwoPaneLayout
        listPane={
          <div className="p-4">
            <h3 className="font-semibold mb-4">Sheets List</h3>
            <div className="space-y-2">
              <div className="p-3 bg-primary/10 rounded border-l-4 border-primary">
                <p className="font-medium">Attendance 2024</p>
                <p className="text-xs text-muted-foreground">32 entities</p>
              </div>
              <div className="p-3 bg-card rounded border border-border hover:bg-accent cursor-pointer">
                <p className="font-medium">Study Progress</p>
                <p className="text-xs text-muted-foreground">18 entities</p>
              </div>
              <div className="p-3 bg-card rounded border border-border hover:bg-accent cursor-pointer">
                <p className="font-medium">Task Tracker</p>
                <p className="text-xs text-muted-foreground">45 entities</p>
              </div>
            </div>
          </div>
        }
        detailPane={
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">Attendance 2024</h2>
            <p className="text-sm text-muted-foreground mb-6">32 entities • Last updated today</p>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-2 text-sm">Student 1</td>
                    <td className="px-4 py-2 text-sm">Present</td>
                    <td className="px-4 py-2 text-sm">Dec 31, 2025</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-2 text-sm">Student 2</td>
                    <td className="px-4 py-2 text-sm">Absent</td>
                    <td className="px-4 py-2 text-sm">Dec 31, 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }
      />
    </div>
  ),
}

/**
 * Mobile viewport (portrait)
 * Shows single column at <768px
 */
export const MobilePortrait: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold">Mobile View</h3>
          <p className="text-sm text-muted-foreground mt-2">Single column layout on narrow viewports</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold">Touch Optimized</h3>
          <p className="text-sm text-muted-foreground mt-2">Content stacks vertically for easy scrolling</p>
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet viewport (portrait)
 * Shows two-pane at ≥768px
 */
export const TabletPortrait: Story = {
  render: () => (
    <div className="h-screen w-full">
      <TwoPaneLayout
        listPane={
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-sm mb-3">List</h3>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="p-2 bg-card rounded text-sm border border-border">
                Item {i + 1}
              </div>
            ))}
          </div>
        }
        detailPane={
          <div className="p-4">
            <h3 className="font-semibold mb-2">Detail</h3>
            <p className="text-sm text-muted-foreground">Two-pane layout visible on tablet</p>
          </div>
        }
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

/**
 * Tablet viewport (landscape)
 * Shows wider two-pane layout with more horizontal space
 */
export const TabletLandscape: Story = {
  render: () => (
    <div className="h-screen w-full">
      <TwoPaneLayout
        listPane={
          <div className="p-4 space-y-2">
            <h3 className="font-semibold mb-3">List (Wider in Landscape)</h3>
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="p-3 bg-card rounded border border-border hover:bg-accent cursor-pointer"
              >
                <p className="font-medium">Item {i + 1}</p>
                <p className="text-xs text-muted-foreground">More room for content</p>
              </div>
            ))}
          </div>
        }
        detailPane={
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Detail View in Landscape</h2>
            <p className="text-muted-foreground mb-6">More horizontal space for detailed content</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Column 1</h4>
                <p className="text-sm">Can show more data side-by-side</p>
              </div>
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Column 2</h4>
                <p className="text-sm">Better use of screen real estate</p>
              </div>
            </div>
          </div>
        }
      />
    </div>
  ),
}

/**
 * No horizontal scroll test (320px minimum)
 * Verify content doesn't overflow at smallest viewport
 */
export const NoHorizontalScroll320px: Story = {
  args: {
    children: (
      <div className="space-y-3">
        <div className="p-3 bg-card rounded border border-border">
          <h4 className="font-medium text-sm mb-1">Very Long Title That Should Wrap Properly</h4>
          <p className="text-xs text-muted-foreground">
            This is a long description that should wrap without causing horizontal scroll even at 320px
            viewport width
          </p>
        </div>
        <div className="p-3 bg-card rounded border border-border">
          <p className="text-xs wrap-break-word">
            LongWordWithoutSpacesLikeAURLOrHashShouldBreakProperly:
            https://example.com/very-long-url-that-might-overflow
          </p>
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
}

/**
 * Dark theme variant
 */
export const DarkTheme: Story = {
  render: () => (
    <div className="h-screen w-full">
      <TwoPaneLayout
        listPane={
          <div className="p-4 space-y-2">
            <h3 className="font-semibold mb-4">Dark Theme List</h3>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="p-3 bg-card rounded border border-border hover:bg-accent cursor-pointer">
                <p className="font-medium">Item {i + 1}</p>
                <p className="text-xs text-muted-foreground">Dark theme styling</p>
              </div>
            ))}
          </div>
        }
        detailPane={
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Dark Theme Detail</h2>
            <p className="text-muted-foreground">Content adapts to dark mode automatically</p>
          </div>
        }
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}
