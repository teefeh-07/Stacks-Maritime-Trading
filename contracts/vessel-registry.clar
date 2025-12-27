;; Stacks Maritime Trading - Vessel Registry
;; Manages registration and status of maritime vessels.

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-VESSEL-ALREADY-EXISTS (err u101))
(define-constant ERR-VESSEL-NOT-FOUND (err u102))
(define-map vessels { vessel-id: uint } { owner: principal, name: (string-ascii 64), capacity: uint, status: (string-ascii 20) })
(define-public (register-vessel (vessel-id uint) (name (string-ascii 64)) (capacity uint))
  (begin
    (asserts! (is-none (map-get? vessels { vessel-id: vessel-id })) ERR-VESSEL-ALREADY-EXISTS)
    (ok (map-set vessels { vessel-id: vessel-id } { owner: tx-sender, name: name, capacity: capacity, status: "active" }))
  )
)

;; Getters
(define-read-only (get-vessel (vessel-id uint))
  (map-get? vessels { vessel-id: vessel-id })
)

(define-public (update-vessel-status (vessel-id uint) (new-status (string-ascii 20)))
