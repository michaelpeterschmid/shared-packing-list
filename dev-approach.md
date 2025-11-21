
Don’t do: “All UI → all React logic → all Firebase at the end.”
Do: small vertical slices (features) that already go from UI → React → Firebase.


1. Set up React + Firebase config early.

2. Build UI with mock data & simple state.

3. Make React logic solid (add / edit / delete etc., still local).

4. Integrate Firebase step by step:

5. auth → groups → items.

6. Add offline/PWA once basic flows work.