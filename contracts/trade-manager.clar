;; Trade Manager Contract
;; Handles cargo booking and delivery tracking.

(define-constant ERR-CARGO-NOT-FOUND (err u200))
(define-constant ERR-INSUFFICIENT-FUNDS (err u201))
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-data-var cargo-id-counter uint u0)

(define-map cargo
  { cargo-id: uint }
  {
    sender: principal,
    vessel-id: uint,
    description: (string-ascii 100),
    status: (string-ascii 20)
  }
)

(define-public (book-cargo (vessel-id uint) (description (string-ascii 100)))
  (let ((cargo-id (+ (var-get cargo-id-counter) u1)))
    (map-set cargo { cargo-id: cargo-id } { sender: tx-sender, vessel-id: vessel-id, description: description, status: "pending" })
    (var-set cargo-id-counter cargo-id)
    (ok cargo-id)
  )
)
