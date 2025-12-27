;; Escrow Contract
;; Manages payment escrow for cargo delivery.

(define-constant ERR-ESCROW-NOT-FOUND (err u300))
(define-constant ERR-ALREADY-RELEASED (err u301))
(define-constant ERR-NOT-AUTHORIZED (err u100))

(define-map escrows { escrow-id: uint } { buyer: principal, seller: principal, amount: uint, released: bool })
(define-data-var escrow-counter uint u0)

(define-public (create-escrow (seller principal) (amount uint))
  (let ((escrow-id (+ (var-get escrow-counter) u1)))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set escrows { escrow-id: escrow-id } { buyer: tx-sender, seller: seller, amount: amount, released: false })
    (var-set escrow-counter escrow-id)
