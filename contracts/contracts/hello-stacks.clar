
;; title: hello-stacks
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;; 

;; constants
;;

;; data vars
;;

;; data maps
;;

(define-map counters uint uint)

;; public functions
;;

(define-read-only (get-count (t uint))
	(default-to u0 (map-get? counters t))
)

(define-public (count-up (t uint))
  (ok (map-set counters t (+ (get-count t) u1)))
)

;; read only functions
;;

;; private functions
;;

