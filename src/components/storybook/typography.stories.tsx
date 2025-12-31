import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Tracker/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

/**
 * Base typography scale
 * Shows font sizes from mobile to tablet
 */
export const FontSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-2">text-xs (12px)</p>
        <p className="text-xs">
          The quick brown fox jumps over the lazy dog. Chữ tiếng Việt có dấu đầy đủ.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">text-sm (14px) - Minimum readable</p>
        <p className="text-sm">
          The quick brown fox jumps over the lazy dog. Chữ tiếng Việt có dấu đầy đủ.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">text-base (16px) - Body text default</p>
        <p className="text-base">
          The quick brown fox jumps over the lazy dog. Chữ tiếng Việt có dấu đầy đủ.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">text-lg (18px)</p>
        <p className="text-lg">
          The quick brown fox jumps over the lazy dog. Chữ tiếng Việt có dấu đầy đủ.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">text-xl (20px)</p>
        <p className="text-xl">
          The quick brown fox jumps over the lazy dog. Chữ tiếng Việt có dấu đầy đủ.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">text-2xl (24px) - Headings</p>
        <p className="text-2xl font-bold">
          The quick brown fox jumps over the lazy dog. Chữ tiếng Việt có dấu đầy đủ.
        </p>
      </div>
    </div>
  ),
}

/**
 * Line height variants
 * Shows tight, normal, and relaxed line heights for readability
 */
export const LineHeights: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-muted-foreground mb-2">leading-tight (1.4) - Compact</p>
        <p className="text-base leading-tight">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Văn bản tiếng Việt với nhiều dòng để kiểm
          tra khoảng cách dòng hợp lý.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">leading-normal (1.5) - Default body text</p>
        <p className="text-base leading-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Văn bản tiếng Việt với nhiều dòng để kiểm
          tra khoảng cách dòng hợp lý.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">leading-relaxed (1.6) - More breathing room</p>
        <p className="text-base leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Văn bản tiếng Việt với nhiều dòng để kiểm
          tra khoảng cách dòng hợp lý.
        </p>
      </div>
    </div>
  ),
}

/**
 * Vietnamese text wrapping
 * Shows proper wrapping of long Vietnamese words and accented characters
 */
export const VietnameseTextWrapping: Story = {
  render: () => (
    <div className="max-w-xs space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Standard wrapping</p>
        <p className="text-base">
          Đây là một đoạn văn bản tiếng Việt với các từ dài như "trách nhiệm", "phát triển", và
          "đặc điểm" để kiểm tra việc xuống dòng tự động.
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">With text-wrap-long utility</p>
        <p className="text-base text-wrap-long">
          Văn bản với từ rất dài: pneumonoultramicroscopicsilicovolcanoconiosis hoặc URL:
          https://example.com/very-long-path/that-should-break-properly
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Accented characters</p>
        <p className="text-base">
          Chữ có dấu: à á ả ã ạ â ấ ầ ẩ ẫ ậ ă ắ ằ ẳ ẵ ặ è é ẻ ẽ ẹ ê ế ề ể ễ ệ ì í ỉ ĩ ị ò ó ỏ õ ọ ô ố
          ồ ổ ỗ ộ ơ ớ ờ ở ỡ ợ ù ú ủ ũ ụ ư ứ ừ ử ữ ự ỳ ý ỷ ỹ ỵ
        </p>
      </div>
    </div>
  ),
}

/**
 * Spacing scale demonstration
 * Shows consistent spacing between elements (8/12/16/20/24px)
 */
export const SpacingScale: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Spacing-2 (8px gap)</p>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Spacing-3 (12px gap)</p>
        <div className="flex gap-3">
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Spacing-4 (16px gap)</p>
        <div className="flex gap-4">
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Spacing-6 (24px gap)</p>
        <div className="flex gap-6">
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
          <div className="h-10 w-10 bg-primary rounded" />
        </div>
      </div>
    </div>
  ),
}

/**
 * Mobile viewport readability (375px)
 * Ensures text is readable at mobile sizes
 */
export const MobileReadability: Story = {
  render: () => (
    <div className="space-y-4 max-w-full">
      <h2 className="text-xl font-bold">Mobile Typography</h2>
      <p className="text-base leading-normal">
        Body text at 16px base size with 1.5 line height for optimal readability on mobile devices.
        Vietnamese text: Văn bản tiếng Việt dễ đọc trên màn hình di động với cỡ chữ phù hợp.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Secondary text at 14px minimum readable size with 1.6 line height. Long content should wrap
        naturally without horizontal scroll even at narrow viewports like 320px width.
      </p>
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="font-semibold mb-2">Card Title</h3>
        <p className="text-sm text-muted-foreground">
          Card content with proper padding and readable text size. No content should overflow or cause
          horizontal scrolling.
        </p>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet viewport readability (768px+)
 * Shows increased spacing and potentially larger text on tablet
 */
export const TabletReadability: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Tablet Typography</h2>
      <p className="text-lg leading-relaxed">
        Larger body text on tablet devices for comfortable reading. Vietnamese text: Văn bản có thể
        lớn hơn một chút trên máy tính bảng để tận dụng không gian màn hình rộng hơn.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Column 1</h3>
          <p className="text-sm text-muted-foreground">
            Multi-column layout on tablet with adequate spacing between columns.
          </p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <h3 className="font-semibold mb-2">Column 2</h3>
          <p className="text-sm text-muted-foreground">
            Content flows naturally across columns with consistent typography.
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

/**
 * Minimum viewport test (320px)
 * Verifies no horizontal scroll at smallest supported width
 */
export const MinimumViewport320px: Story = {
  render: () => (
    <div className="space-y-3">
      <h3 className="text-base font-bold">320px Width Test</h3>
      <p className="text-sm leading-relaxed">
        This content must not cause horizontal scrolling. Very long words or URLs should break properly:
        https://example.com/very-long-url-path-that-needs-to-wrap
      </p>
      <div className="p-3 bg-card border border-border rounded">
        <p className="text-xs wrap-break-word">
          LongTextWithoutSpaces: pneumonoultramicroscopicsilicovolcanoconiosis
        </p>
      </div>
      <button className="w-full min-h-11 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium">
        Button with adequate height (44px)
      </button>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
}

/**
 * Form controls readability
 * Shows proper sizing and spacing for form elements
 */
export const FormControls: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div>
        <label htmlFor="input1" className="block text-sm font-medium mb-2">
          Input Label (≥14px)
        </label>
        <input
          id="input1"
          type="text"
          placeholder="Placeholder text"
          className="w-full min-h-11 px-3 py-2 border border-input rounded text-base bg-background"
        />
        <p className="text-xs text-muted-foreground mt-1">Helper text for guidance</p>
      </div>
      <div>
        <label htmlFor="textarea1" className="block text-sm font-medium mb-2">
          Textarea Label
        </label>
        <textarea
          id="textarea1"
          placeholder="Enter multiple lines of text"
          rows={4}
          className="w-full px-3 py-2 border border-input rounded text-base bg-background resize-y"
        />
      </div>
      <div className="flex gap-2">
        <button className="flex-1 min-h-11 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium touch-target">
          Primary (≥44px)
        </button>
        <button className="flex-1 min-h-11 px-4 py-2 border border-border rounded text-sm font-medium touch-target">
          Secondary
        </button>
      </div>
    </div>
  ),
}

/**
 * Dark theme typography
 */
export const DarkTheme: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dark Theme Typography</h2>
      <p className="text-base leading-normal">
        Body text maintains readability in dark mode with proper contrast. Vietnamese text: Văn bản dễ
        đọc trong chế độ tối với độ tương phản phù hợp.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Muted text remains legible but de-emphasized for secondary information.
      </p>
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="font-semibold mb-2">Card in Dark Mode</h3>
        <p className="text-sm text-muted-foreground">
          Card backgrounds adapt automatically with consistent readability.
        </p>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="dark bg-background text-foreground p-6">
        <Story />
      </div>
    ),
  ],
}
