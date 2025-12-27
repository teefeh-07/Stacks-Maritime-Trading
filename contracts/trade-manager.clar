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
