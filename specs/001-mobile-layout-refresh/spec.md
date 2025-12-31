# Feature Specification: Mobile-first layout refresh

**Feature Branch**: `001-mobile-layout-refresh`  
**Created**: 2025-12-31  
**Status**: Draft  
**Input**: User description: "cập nhật lại layout của website. Hiện tại layout sử dụng lại layout của tanstack boilerplate. Layout nayf không phù hợp với ứng dụng hiện tại. Chúng ta cần cập nhật lại layout để phù hợp với nó hơn. Đặc biệt chú ý, vì chúng ta phát triển focus vào mobile, tablet vì vậy layout cần phù hợp với table và mobile first"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile-first navigation access (Priority: P1)

Người dùng mở ứng dụng trên điện thoại và cần truy cập các màn quan trọng (Trang chủ/Trang danh sách sheet/Trang tạo mới) trong 1-2 chạm, với thanh điều hướng và nút hành động chính luôn nằm trong vùng ngón tay cái.

**Why this priority**: Điều hướng nhanh trên mobile là rào cản lớn nhất; nếu không cải thiện, người dùng bỏ cuộc sớm.

**Independent Test**: Trên màn hình 375px, kiểm tra người dùng có thể mở 3 điểm đến chính và kích hoạt hành động tạo mới trong ≤2 thao tác, không cần cuộn.

**Acceptance Scenarios**:

1. **Given** người dùng ở bất kỳ màn hiện có, **When** họ cần về trang danh sách chính, **Then** thanh điều hướng hiển thị nút về nhà trong vùng chạm 44px và hoạt động trong ≤2 thao tác.
2. **Given** người dùng muốn tạo mới (sheet/bản ghi chính), **When** họ chạm nút hành động nổi hoặc nút tạo mới, **Then** hành động khởi chạy ngay và nút nằm trong vùng chạm thuận tay (dưới cùng hoặc phải dưới) mà không che nội dung chính.

---

### User Story 2 - Tablet-friendly adaptive layout (Priority: P2)

Người dùng trên tablet cần xem danh sách và nội dung chi tiết song song (ví dụ danh sách sheet và vùng nội dung) mà không phải chuyển tab liên tục.

**Why this priority**: Tablet có không gian lớn; tận dụng giúp thao tác nhanh hơn và tránh cảm giác ứng dụng phóng to từ mobile.

**Independent Test**: Trên viewport ≥768px, kiểm tra hiển thị hai-pane (danh sách + nội dung) hoặc lưới 2 cột; các thao tác điều hướng không buộc người dùng quay về trang trước.

**Acceptance Scenarios**:

1. **Given** người dùng ở tablet, **When** chọn một mục trong danh sách, **Then** nội dung chi tiết xuất hiện cạnh bên (không phủ toàn màn) và danh sách vẫn thấy được.
2. **Given** người dùng xoay màn hình (portrait → landscape), **When** tiếp tục duyệt, **Then** bố cục tự điều chỉnh (ví dụ tăng số cột, giữ vùng chạm ≥44px) mà không làm mất trạng thái đang xem.

---

### User Story 3 - Content readability and controls (Priority: P2)

Người dùng cần đọc nội dung và thao tác với form/ngữ cảnh dài mà không phải cuộn ngang hay phóng to thu nhỏ.

**Why this priority**: Đọc và nhập liệu là hành động chính; nếu chữ nhỏ, khoảng cách chật sẽ tăng lỗi nhập.

**Independent Test**: Trên màn 375px, kiểm tra không có cuộn ngang; cỡ chữ, khoảng cách dòng, khoảng đệm đảm bảo đọc được; các nút chính có tối thiểu 44px chiều cao.

**Acceptance Scenarios**:

1. **Given** người dùng mở form dài, **When** cuộn dọc, **Then** tiêu đề khu vực vẫn dễ nhận biết, và không xuất hiện thanh cuộn ngang.
2. **Given** một danh sách thẻ/card nhiều dòng, **When** người dùng xem ở 375px, **Then** văn bản không bị cắt, khoảng cách dòng đủ thoáng, và hình ảnh/biểu tượng tự co để không đẩy chữ ra ngoài khung.

---

### Edge Cases

- Màn hình rất hẹp (≤320px) hoặc phóng to hệ thống: bố cục có còn giữ vùng chạm 44px, tránh tràn chữ?
- Ngôn ngữ dài (tiếng Việt dấu, tên danh mục dài): tiêu đề/dãn dòng có vỡ layout hay bị cắt?
- Thiết bị có tai thỏ/notch và thanh điều hướng hệ thống: các thanh trên/dưới có chừa khoảng an toàn (safe area)?
- Chuyển nhanh giữa các chế độ sáng/tối: độ tương phản, nền/viền còn đủ phân tách?
- Khi nội dung trống (empty state) hoặc danh sách rất dài: bố cục giữ được cân bằng, có skeleton/loading hợp lý?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Layout MUST expose 3-4 điểm đến chính ở thanh điều hướng luôn hiển thị trên mobile mà không cần mở menu ẩn.
- **FR-002**: Layout MUST provide a primary action entry point (tạo mới) luôn khả dụng trên mọi màn hình mà không che nội dung chính.
- **FR-003**: Layout MUST adapt to tablet with song song hai vùng (danh sách + nội dung) hoặc lưới nhiều cột, không buộc điều hướng ngược để xem chi tiết.
- **FR-004**: Layout MUST enforce tối thiểu 44px cho mọi vùng tương tác (nút, item danh sách, tab) trên mobile và tablet.
- **FR-005**: Layout MUST prevent horizontal scrolling at widths ≥320px for tất cả màn hình chính.
- **FR-006**: Layout MUST maintain readable typography (cỡ chữ tối thiểu 14px, line-height thoáng) và khoảng đệm nhất quán giữa các khối.
- **FR-007**: Layout MUST handle safe areas (notch, home indicator) để thanh trên/dưới không bị che và nội dung không bị khuất.
- **FR-008**: Layout MUST support light/dark theme contrast đủ để phân biệt điều hướng, nền và nội dung.
- **FR-009**: Layout MUST apply the existing tracker color palette to header/nav and include a lightweight app logo/wordmark while preserving text contrast.
- **FR-010**: Layout MUST use a back button + title pattern on mobile headers; breadcrumbs are omitted on mobile and may be optional on tablet if helpful.
- **FR-011**: Layout MUST surface Home, Sheets, Settings as persistent nav items; the Create action appears as a floating/primary action outside the nav slots and must not block content, while remaining scalable if more items are added later.

### Key Entities

- **Layout shell**: vùng khung bao gồm header, nội dung, footer/bottom bar; giữ khoảng an toàn và nền.
- **Navigation zone**: tập hợp các điểm đến chính, trạng thái đang chọn, badge/thông báo (nếu có).
- **Primary action**: hành động nổi/bottom action dùng nhiều nhất (tạo mới, thêm mục), có vị trí ưu tiên trên mobile.
- **Content region**: khu hiển thị nội dung chính; trên tablet có thể chia 2 pane (danh sách + chi tiết) hoặc lưới.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng trên màn 375px truy cập 3 điểm đến chính và hành động tạo mới trong ≤2 thao tác, không cần cuộn.
- **SC-002**: 100% nút và item chạm chính đạt ≥44px chiều cao/rộng trên mobile và tablet.
- **SC-003**: Không xuất hiện cuộn ngang trên màn ≥320px trong 95% trang/chế độ xem.
- **SC-004**: Trên tablet (≥768px), danh sách và nội dung cùng hiển thị đồng thời trong ≥80% các màn phù hợp (home, danh sách + chi tiết).
- **SC-005**: 90% người dùng thử nghiệm đánh giá “dễ đọc/dễ chạm” (CSAT ≥4/5) sau 1 vòng dùng thử trên mobile.
- **SC-006**: Thời gian người dùng tìm thấy và kích hoạt hành động chính ≤3 giây trong thử nghiệm mục tiêu.

## Assumptions

- Ứng dụng giữ cấu trúc trang hiện có (home, tracker sheets, settings); thay đổi chủ yếu là khung và trình bày.
- Không thêm tính năng nghiệp vụ mới; chỉ thay đổi bố cục, điều hướng, khoảng đệm, kiểu chữ, trạng thái hiển thị.
- Ít nhất một thương hiệu/màu chủ đạo sẵn sàng áp dụng; nếu chưa, sẽ cần quyết định thêm.

