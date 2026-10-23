// English source strings remain the stable keys. Only presentation text changes:
// model inputs, select values, equations' numerical values, and timing stay intact.
const german = {
  "Gold marks information flow, not activation strength. Moving dots show selected connections; all connections contribute to the result.":
    "Gold markiert den Informationsfluss, nicht die Aktivierungsstärke. Bewegte Punkte zeigen ausgewählte Verbindungen; alle Verbindungen fließen in das Ergebnis ein.",
  "Information flow animation": "Animation des Informationsflusses",
  "Pause flow": "Fluss pausieren",
  "Play flow": "Fluss starten",
  "Replay flow": "Fluss wiederholen",
  "Next flow step": "Nächster Verarbeitungsschritt",
  "Next flow step →": "Nächster Verarbeitungsschritt →",
  "Illustrative timing": "Schematischer Zeitablauf",
  "Input values": "Eingabewerte",
  "Weighted sum + ReLU": "Gewichtete Summe + ReLU",
  "Output scores → probabilities": "Ausgabewerte → Wahrscheinlichkeiten",
  "35 input pixels": "35 Eingabepixel",
  "Hidden layer 1 · 24 neurons": "Verdeckte Schicht 1 · 24 Neuronen",
  "Hidden layer 2 · 16 neurons": "Verdeckte Schicht 2 · 16 Neuronen",
  "Hidden layer 3 · 12 neurons": "Verdeckte Schicht 3 · 12 Neuronen",
  "10 output probabilities": "10 Ausgabewahrscheinlichkeiten",
  "Tokens → embeddings": "Tokens → Embeddings",
  "Block 1 · attention mixes context":
    "Block 1 · Attention verknüpft den Kontext",
  "Block 1 · projections + gate": "Block 1 · Projektionen + Gate",
  "Block 1 · projection back": "Block 1 · Rückprojektion",
  "Block 2 · attention + feed-forward": "Block 2 · Attention + Feed-forward",
  "Blocks 3–30 · same sequence, different weights":
    "Blöcke 3–30 · gleicher Ablauf, andere Gewichte",
  "Block 31 · attention + feed-forward": "Block 31 · Attention + Feed-forward",
  "Block 32 · attention + feed-forward": "Block 32 · Attention + Feed-forward",
  "Final norm → vocabulary scores":
    "Abschließende Normierung → Vokabular-Scores",
  "Probabilities for the next token":
    "Wahrscheinlichkeiten für das nächste Token",
  "Animated schematic · no LLM inference":
    "Animiertes Schema · keine LLM-Berechnung",
  "1,598": "1.598",
  "1,598 parameters": "1.598 Parameter",
  "35 → 24 → 16 → 12 → 10 neurons": "35 → 24 → 16 → 12 → 10 Neuronen",
  "1,598 weights and biases; inference stays on this device.":
    "1.598 Gewichte und Bias-Werte; die Berechnung bleibt auf diesem Gerät.",
  "1,536 connections · 62 biases": "1.536 Verbindungen · 62 Bias-Werte",
  "Inspect a hidden layer": "Eine verdeckte Schicht untersuchen",
  "Digit network with 35 inputs, three hidden layers of 24, 16 and 12 neurons, and 10 outputs":
    "Ziffernnetz mit 35 Eingängen, drei verdeckten Schichten aus 24, 16 und 12 Neuronen sowie 10 Ausgängen",
  "Click a neuron in any hidden layer":
    "Klicke auf ein Neuron in einer verdeckten Schicht",
  "Each layer receives the previous layer’s outputs. Colors are scaled within each layer.":
    "Jede Schicht erhält die Ausgaben der vorherigen Schicht. Die Farbskala gilt jeweils innerhalb einer Schicht.",
  "Scroll the diagram sideways to inspect all layers.":
    "Das Diagramm seitlich verschieben, um alle Schichten zu sehen.",
  "Same calculation in every layer.": "Gleiche Rechnung in jeder Schicht.",
  "3 hidden layers · 1,598 trained parameters":
    "3 verdeckte Schichten · 1.598 trainierte Parameter",
  "ReLU(Σ inputᵢ × weightᵢ + bias)": "ReLU(Σ Eingabeᵢ × Gewichtᵢ + Bias)",
  "Inputs: 35 pixel values.": "Eingaben: 35 Pixelwerte.",
  "The highlighted connections belong to this neuron.":
    "Die hervorgehobenen Verbindungen gehören zu diesem Neuron.",
  "Repeated transformer blocks": "Aufeinanderfolgende Transformer-Blöcke",
  "28 intermediate blocks": "28 dazwischenliegende Blöcke",
  "32 blocks in sequence · separate learned weights in every block":
    "32 Blöcke nacheinander · eigene gelernte Gewichte in jedem Block",
  "Two projections + SwiGLU gate": "Zwei Projektionen + SwiGLU-Gate",
  "4,096 → wider → 4,096 features": "4.096 → breiter → 4.096 Merkmale",
  Input: "Eingabe",
  "Gated features": "Merkmale nach Gating",
  Output: "Ausgabe",
  "Two learned projections are combined by a SwiGLU gate, then projected back. Sketch: a few representative features, not individual model neurons.":
    "Zwei gelernte Projektionen werden durch ein SwiGLU-Gate verknüpft und zurückprojiziert. Skizze: wenige stellvertretende Merkmale, keine einzelnen Modellneuronen.",
  "Digits: 3 hidden layers, 1,598 parameters. Llama 3 8B: 32 blocks, about 8 billion parameters — roughly 5 million times as many.":
    "Ziffernnetz: 3 verdeckte Schichten, 1.598 Parameter. Llama 3 8B: 32 Blöcke, etwa 8 Milliarden Parameter – ungefähr 5 Millionen Mal so viele.",
  "Thirty-five pixels pass through three hidden layers: 24, 16, then 12 neurons. Each layer passes its outputs to the next.":
    "35 Pixel durchlaufen drei verdeckte Schichten mit 24, 16 und 12 Neuronen. Jede Schicht gibt ihre Ausgaben an die nächste weiter.",
  "Three hidden layers repeat the same calculation. Each of the 1,598 parameters contributes to the prediction.":
    "Drei verdeckte Schichten wiederholen dieselbe Rechnung. Jeder der 1.598 Parameter fließt in die Vorhersage ein.",
  "A 35 → 24 → 16 → 12 → 10 network has three ReLU hidden layers and 1,598 parameters. It was trained with backpropagation and stochastic gradient descent on ten original 5 × 7 bitmap patterns with random pixel flips. Inference runs in your browser. These are simple synthetic symbols, not MNIST or arbitrary handwriting. The network must choose among ten digits even for nonsense input; a high output probability does not prove that it is right.":
    "Ein 35 → 24 → 16 → 12 → 10-Netz hat drei verdeckte ReLU-Schichten und 1.598 Parameter. Es wurde mit Backpropagation und stochastischem Gradientenabstieg auf zehn selbst erstellten 5 × 7-Pixelmustern mit zufällig gekippten Pixeln trainiert. Die Vorhersage läuft in deinem Browser. Es handelt sich um einfache synthetische Symbole, nicht um MNIST oder beliebige Handschrift. Selbst bei unsinnigen Eingaben muss das Netz zwischen zehn Ziffern wählen; eine hohe Ausgabewahrscheinlichkeit beweist nicht, dass die Vorhersage stimmt.",
  "CC BY-SA 4.0": "CC BY-SA 4.0",
  "Guided sequence paused. Resume to return to the current step in the sequence.":
    "Geführter Ablauf pausiert. Beim Fortsetzen kehrt die Ansicht zum aktuellen Schritt des Ablaufs zurück.",
  "Skip to interactive demo": "Zur interaktiven Demo",
  "MasanneckLab neural network demo": "MasanneckLab: Demo neuronaler Netze",
  "AN INTERACTIVE FIELD GUIDE": "EIN INTERAKTIVER EINBLICK",
  Present: "Präsentieren",
  "Exit presentation": "Präsentation beenden",
  "Share / QR": "Teilen / QR",
  "View source on GitHub": "Quellcode auf GitHub ansehen",
  "INTERACTIVE DEMONSTRATION": "INTERAKTIVE DEMONSTRATION",
  "Neural networks: structure and scale · MasanneckLab":
    "Neuronale Netze: Aufbau und Skalierung · MasanneckLab",
  "Neural networks:": "Neuronale Netze:",
  "Structure and scale": "Aufbau und Skalierung",
  "An interactive comparison of binary classification, digit recognition, and transformer architecture.":
    "Ein interaktiver Vergleich von binärer Klassifikation, Ziffernerkennung und Transformer-Architektur.",
  "An interactive journey from a tiny neural network to a large language model. See the calculations, edit pixels, and explore a transformer.":
    "Eine interaktive Reise vom kleinen neuronalen Netz zum großen Sprachmodell. Rechenwege nachvollziehen, Pixel verändern und einen Transformer erkunden.",
  "Two outcomes. Ten digits. Billions of parameters. Explore the common building blocks.":
    "Zwei Ausgänge. Zehn Ziffern. Milliarden Parameter. Entdecke die gemeinsamen Bausteine.",
  "Play the 75-second story": "75-Sekunden-Tour starten",
  "Pause story": "Tour pausieren",
  "Resume story": "Tour fortsetzen",
  "Replay the story": "Tour erneut starten",
  "Choose a network": "Netzwerk auswählen",
  "Two outcomes": "Zwei Ausgänge",
  "Trace every calculation": "Jeden Rechenschritt verstehen",
  "Ten digits": "Zehn Ziffern",
  "Recognize a pattern": "Ein Muster erkennen",
  "A language model": "Ein Sprachmodell",
  "Connect the building blocks": "Die Bausteine verbinden",
  "~8B": "~8 Mrd.",
  "01 / BINARY CLASSIFICATION": "01 / BINÄRE KLASSIFIKATION",
  "Binary classification with a small network":
    "Binäre Klassifikation mit einem kleinen Netz",
  "12 parameters": "12 Parameter",
  "2 inputs → 2 hidden → 2 outputs":
    "2 Eingänge → 2 verdeckte Neuronen → 2 Ausgänge",
  "A neuron is a small calculation.":
    "Ein Neuron führt eine einfache Rechnung aus.",
  "02 / DIGIT CLASSIFICATION": "02 / ZIFFERNKLASSIFIKATION",
  "Digit classification from pixel inputs":
    "Ziffernklassifikation aus Pixeleingaben",
  "Weights now come from training.":
    "Die Gewichte stammen jetzt aus dem Training.",
  "03 / TRANSFORMER ARCHITECTURE": "03 / TRANSFORMER-ARCHITEKTUR",
  "Architecture of a transformer language model":
    "Architektur eines Transformer-Sprachmodells",
  "~8 billion parameters": "~8 Milliarden Parameter",
  "Llama 3 8B · architecture reference":
    "Llama 3 8B · Architektur als Referenz",
  "Attention adds context between tokens.":
    "Attention verknüpft Tokens mit ihrem Kontext.",
  "01 / Input": "01 / Eingabe",
  "Exactly one switch?": "Genau ein Schalter?",
  "The light should be ON when one switch is on, and the other is off.":
    "Das Licht soll AN sein, wenn genau einer der beiden Schalter eingeschaltet ist.",
  "Try it:": "Probiere es aus:",
  "turn both on.": "Schalte beide ein.",
  "Two hidden neurons detect the two ways the switches can differ.":
    "Zwei verdeckte Neuronen erfassen die beiden Fälle, in denen sich die Schalter unterscheiden.",
  "Hand-set weights · real calculation": "Feste Gewichte · echte Berechnung",
  "Every connection is visible": "Jede Verbindung ist sichtbar",
  "Brighter node = stronger activation":
    "Kräftigere Farbe = stärkere Aktivierung",
  "Illustrated signal flow": "Schematischer Signalfluss",
  "03 / Output": "03 / Ausgabe",
  ON: "AN",
  OFF: "AUS",
  TIE: "GLEICH",
  "Two scores become two probabilities through":
    "Zwei Ausgabewerte werden zu Wahrscheinlichkeiten durch",
  ". Pick the larger one.": ". Der größere Wert entscheidet.",
  "Trace the output scores": "Ausgabewerte nachvollziehen",
  "Multiply, add a bias, apply ReLU.":
    "Multiplizieren, Bias addieren, ReLU anwenden.",
  "ReLU keeps positive values; otherwise 0.":
    "ReLU: positive Werte bleiben, sonst 0.",
  "Edit a weight: A → h₁": "Gewicht ändern: A → h₁",
  "Weight from switch A to hidden neuron 1":
    "Gewicht von Schalter A zum verdeckten Neuron 1",
  "Reset weight to +1": "Gewicht auf +1 zurücksetzen",
  INPUT: "EINGABE",
  "HIDDEN LAYER": "VERDECKTE SCHICHT",
  OUTPUT: "AUSGABE",
  "Fully connected neural network with two inputs, two hidden neurons and two output probabilities":
    "Vollständig verbundenes Netz mit zwei Eingängen, zwei verdeckten Neuronen und zwei Ausgabewahrscheinlichkeiten",
  "35 pixels": "35 Pixel",
  "10 digits": "10 Ziffern",
  "Click a hidden neuron to trace its connections":
    "Klicke auf ein verdecktes Neuron, um seine Verbindungen zu verfolgen",
  "The digit model could not load.":
    "Das Ziffernmodell konnte nicht geladen werden.",
  "Loading the small digit model…": "Das kleine Ziffernmodell wird geladen …",
  "Check the connection and reload this page. The two-outcome network and language schematic are still available.":
    "Prüfe die Verbindung und lade die Seite neu. Das Netz mit zwei Ausgängen und das Sprachmodell-Schema bleiben verfügbar.",
  "Retry loading": "Erneut laden",
  "Editable 5 by 7 digit pixels": "Bearbeitbare Ziffer aus 5 mal 7 Pixeln",
  "Choose an example digit": "Eine Beispielziffer auswählen",
  Clear: "Leeren",
  "Flip 3 pixels": "3 Pixel kippen",
  "Click or drag over pixels.": "Pixel anklicken oder darüberziehen.",
  "Every pixel is one number: 0 or 1.": "Jeder Pixel ist eine Zahl: 0 oder 1.",
  "Trained weights · live inference": "Trainierte Gewichte · live berechnet",
  "03 / Prediction": "03 / Vorhersage",
  "Simple symbols, learned from examples.":
    "Einfache Symbole, aus Beispielen gelernt.",
  "A high probability can still be wrong.":
    "Auch eine hohe Wahrscheinlichkeit kann falsch liegen.",
  "Same calculation. More inputs.": "Gleiche Rechnung. Mehr Eingänge.",
  "Weights learned by backpropagation.":
    "Gewichte durch Backpropagation gelernt.",
  "Every weight and bias counts.": "Jedes Gewicht und jeder Bias zählt.",
  "Blank input: there is no digit. The network still assigns probabilities to its ten classes.":
    "Leere Eingabe: keine Ziffer. Das Netz verteilt trotzdem Wahrscheinlichkeiten auf seine zehn Klassen.",
  "Trained on simple synthetic symbols. A high probability can still be wrong.":
    "Mit einfachen synthetischen Symbolen trainiert. Auch eine hohe Wahrscheinlichkeit kann falsch liegen.",
  "ReLU(Σ pixelᵢ × weightᵢ + bias)": "ReLU(Σ Pixelᵢ × Gewichtᵢ + Bias)",
  "35 weighted pixel values + one bias. Connections are highlighted above.":
    "35 gewichtete Pixelwerte + ein Bias. Die Verbindungen sind oben hervorgehoben.",
  "01 / Context": "01 / Kontext",
  "Choose a prompt": "Einen Prompt auswählen",
  France: "Frankreich",
  Italy: "Italien",
  The: "Die",
  capital: "Hauptstadt",
  of: "von",
  is: "ist",
  Rome: "Rom",
  Milan: "Mailand",
  Tokyo: "Tokio",
  the: "die",
  a: "eine",
  "Text becomes tokens, then vectors of numbers.":
    "Text wird zu Tokens, dann zu Zahlenvektoren.",
  "Real tokens can be words, parts of words, or punctuation. These chunks are simplified.":
    "Tokens können Wörter, Wortteile oder Satzzeichen sein. Die Aufteilung hier ist vereinfacht.",
  "Schematic · no LLM running": "Schema · hier läuft kein LLM",
  "Inside a decoder-only transformer":
    "Einblick in einen Decoder-only-Transformer",
  "Values are illustrative": "Werte zur Veranschaulichung",
  "Token embeddings": "Token-Embeddings",
  "Transformer block": "Transformer-Block",
  "NORM + POSITION IN ATTENTION": "NORM + POSITION IN ATTENTION",
  "Self-attention": "Self-Attention",
  "Mix information across tokens": "Information zwischen Tokens verknüpfen",
  "Feed-forward network": "Feedforward-Netz",
  "Transform each token’s features": "Merkmale jedes Tokens umformen",
  "+ residual paths around both sublayers":
    "+ Residualverbindungen um beide Teilschichten",
  "Final norm → scores → softmax": "Finale Norm → Ausgabewerte → Softmax",
  "32 repeated transformer blocks": "32 aufeinanderfolgende Transformer-Blöcke",
  "32 blocks · 4,096 features per token · schematic, not to scale":
    "32 Blöcke · 4.096 Merkmale pro Token · schematisch, nicht maßstabsgetreu",
  "03 / Next token": "03 / Nächstes Token",
  "Four invented candidate scores, for illustration. Real models score the full vocabulary.":
    "Vier frei gewählte Beispielwerte. Echte Modelle bewerten das gesamte Vokabular.",
  "Step through the process →": "Ablauf schrittweise ansehen →",
  "Click a block to look inside.": "Klicke auf einen Block für einen Einblick.",
  "Context integration through attention": "Kontextintegration durch Attention",
  "An illustrative attention row for “is”.":
    "Eine beispielhafte Attention-Zeile für „ist“.",
  "Tokens can mix information from earlier tokens and themselves.":
    "Tokens verknüpfen Informationen aus vorherigen Tokens und sich selbst.",
  "Q, K, V are learned projections. M masks future tokens. Displayed values are illustrative.":
    "Q, K, V sind gelernte Projektionen. M maskiert spätere Tokens. Die Werte sind beispielhaft.",
  "Feed-forward sublayer": "Feedforward-Teilschicht",
  "Each token passes through the same feed-forward network.":
    "Jedes Token durchläuft dasselbe Feedforward-Netz.",
  "Weighted transforms": "Gewichtete Transformationen",
  "+ a nonlinearity": "+ eine Nichtlinearität",
  "Llama uses a gated nonlinearity (SwiGLU), not the small demo’s ReLU.":
    "Llama nutzt eine gesteuerte Nichtlinearität (SwiGLU); das kleine Demo-Netz nutzt ReLU.",
  "Shared computational building blocks.": "Gemeinsame Rechenbausteine.",
  "More features, more layers, and learned representations make full explanations harder.":
    "Mehr Merkmale, mehr Schichten und gelernte Repräsentationen erschweren eine vollständige Erklärung.",
  "1 / 4 · Tokens become vectors of numbers.":
    "1 / 4 · Tokens werden zu Zahlenvektoren.",
  "2 / 4 · Attention mixes the available context.":
    "2 / 4 · Attention verknüpft den verfügbaren Kontext.",
  "3 / 4 · Feed-forward layers transform features; blocks repeat.":
    "3 / 4 · Feedforward-Schichten formen Merkmale um; Blöcke wiederholen sich.",
  "4 / 4 · Select a next token, append it, and repeat.":
    "4 / 4 · Nächstes Token auswählen, anhängen und wiederholen.",
  "Replay the process ↺": "Ablauf wiederholen ↺",
  "Next step →": "Nächster Schritt →",
  "Start small. Two numbers enter a network with just twelve weights and biases.":
    "Wir beginnen klein: Zwei Zahlen fließen in ein Netz mit nur zwölf Gewichten und Bias-Werten.",
  "Each hidden neuron multiplies, adds, and applies a simple rule: keep positive values.":
    "Jedes verdeckte Neuron multipliziert, addiert und wendet eine einfache Regel an: Positive Werte bleiben erhalten.",
  "Turn both switches on. Neither hidden neuron detects a difference, so the output changes to OFF.":
    "Beide Schalter sind an. Kein verdecktes Neuron erkennt einen Unterschied – die Ausgabe wechselt zu AUS.",
  "Now only switch B is on. The other hidden neuron activates. You can trace the whole decision.":
    "Jetzt ist nur Schalter B an. Das andere verdeckte Neuron wird aktiv. Die ganze Entscheidung lässt sich nachvollziehen.",
  "A digit is a grid of numbers. This small trained network uses exactly the same kinds of operations.":
    "Eine Ziffer ist ein Raster aus Zahlen. Das kleine trainierte Netz verwendet dieselben Arten von Rechenschritten.",
  "The weights were learned from examples. Change the pattern and the prediction changes.":
    "Die Gewichte wurden aus Beispielen gelernt. Ändert sich das Muster, ändert sich die Vorhersage.",
  "A language model also transforms numbers with learned weights — at a vastly larger scale.":
    "Auch ein Sprachmodell verarbeitet Zahlen mit gelernten Gewichten – in einem enorm größeren Maßstab.",
  "Transformers add attention: tokens mix information from their context. These values are illustrative.":
    "Transformer ergänzen Attention: Tokens verknüpfen Informationen aus ihrem Kontext. Die Werte hier sind beispielhaft.",
  "Inside every block is a feed-forward network: a familiar building block, repeated many times.":
    "In jedem Block steckt ein Feedforward-Netz: ein vertrauter Baustein, der oft wiederholt wird.",
  "The output scores possible next tokens. Select one, add it to the context, and repeat.":
    "Die Ausgabe bewertet mögliche nächste Tokens. Eines auswählen, an den Kontext anhängen und wiederholen.",
  "The operations are understandable. Explaining the behavior learned by billions of parameters is much harder.":
    "Die Rechenschritte sind verständlich. Das von Milliarden Parametern gelernte Verhalten zu erklären, ist deutlich schwieriger.",
  "Shared building blocks": "Gemeinsame Bausteine",
  "Shared computational principles": "Gemeinsame Rechenprinzipien",
  "Multiply by weights": "Mit Gewichten multiplizieren",
  "Add & transform": "Addieren & umformen",
  "Pass it forward": "Weitergeben",
  "GUIDED STORY": "GEFÜHRTE TOUR",
  "Restart story": "Tour neu starten",
  "End story": "Tour beenden",
  "Interactive model demonstration.": "Interaktive Modelldemonstration.",
  "Models, methods, and limitations": "Modelle, Methoden und Grenzen",
  explore: "erkunden",
  space: "Leertaste",
  "play / pause": "starten / pausieren",
  "Previous chapter": "Vorheriges Kapitel",
  "Next chapter": "Nächstes Kapitel",
  Language: "Sprache",
  "Choose language": "Sprache auswählen",
  "Close share dialog": "Teilen-Dialog schließen",
  "LINK AND QR CODE": "LINK UND QR-CODE",
  "Open or share the demonstration": "Demonstration öffnen oder teilen",
  "QR code for the public neural networks demo":
    "QR-Code zur öffentlichen Demo neuronaler Netze",
  "Copy link": "Link kopieren",
  "Copied!": "Kopiert!",
  "Select the address above": "Adresse oben auswählen",
  "Download QR": "QR herunterladen",
  "Open on a phone. No account, API key, or installation.":
    "Auf dem Smartphone öffnen. Ohne Konto, API-Schlüssel oder Installation.",
  "Close explanation": "Erklärung schließen",
  "MODELS AND METHODS": "MODELLE UND METHODEN",
  "Model implementation.": "Implementierung der Modelle.",
  "Scope and limitations.": "Aussagekraft und Grenzen.",
  "01 · Two outcomes — actual arithmetic":
    "01 · Zwei Ausgänge – echte Berechnung",
  "A 2 → 2 → 2 network solves exclusive OR (XOR): the output is ON when exactly one switch is on. Its 12 weights and biases were set by hand. The hidden layer uses ReLU; the two output scores become probabilities with softmax. Moving the weight slider changes the actual calculation. The probability values are not calibrated confidence estimates.":
    "Ein 2 → 2 → 2-Netz löst das exklusive Oder (XOR): Die Ausgabe ist AN, wenn genau ein Schalter eingeschaltet ist. Seine zwölf Gewichte und Bias-Werte wurden von Hand festgelegt. Die verdeckte Schicht nutzt ReLU; Softmax wandelt die beiden Ausgabewerte in Wahrscheinlichkeiten um. Der Gewichtsregler verändert die tatsächliche Rechnung. Die Wahrscheinlichkeiten sind keine kalibrierten Konfidenzschätzungen.",
  "02 · Ten digits — actual trained inference":
    "02 · Zehn Ziffern – echte Vorhersagen eines trainierten Netzes",
  "03 · A language model — an architecture illustration":
    "03 · Ein Sprachmodell – eine Darstellung der Architektur",
  "The scale reference is Llama 3 8B: 32 transformer blocks and 4,096 features per token. The prompt chunks, attention values, and four-way next-token probabilities are authored illustrations, not outputs or tokenizer results from Llama. No language model is loaded. A real model scores its entire token vocabulary.":
    "Als Größenreferenz dient Llama 3 8B: 32 Transformer-Blöcke und 4.096 Merkmale pro Token. Die Prompt-Abschnitte, Attention-Werte und Wahrscheinlichkeiten der vier Folgetokens sind frei gewählte Beispiele, keine Ausgaben oder Tokenizer-Ergebnisse von Llama. Es wird kein Sprachmodell geladen. Ein echtes Modell bewertet sein gesamtes Token-Vokabular.",
  "Transformers share learned weighted operations and nonlinear feed-forward networks with smaller neural nets, and add attention, residual connections, normalization, and positional information. The diagram compresses these operations. Knowing the architecture is not the same as explaining every learned behavior. Attention weights alone are not a faithful explanation of a model’s decision.":
    "Transformer nutzen wie kleinere neuronale Netze gelernte gewichtete Rechenoperationen und nichtlineare Feedforward-Netze. Hinzu kommen Attention, Residualverbindungen, Normalisierung und Positionsinformationen. Die Darstellung fasst diese Schritte zusammen. Die Architektur zu kennen bedeutet nicht, jedes gelernte Verhalten erklären zu können. Attention-Gewichte allein liefern keine verlässliche Erklärung einer Modellentscheidung.",
  "Read further": "Weiterlesen",
  "Meta · Llama 3 reference architecture ↗":
    "Meta · Referenzarchitektur von Llama 3 ↗",
  "Meta · Llama 3 model card ↗": "Meta · Modellbeschreibung von Llama 3 ↗",
  "No analytics, external fonts, or remote inference. All interactive calculations stay on your device.":
    "Keine Analyse-Tracker, externen Schriftarten oder entfernten Modellberechnungen. Alle interaktiven Berechnungen bleiben auf deinem Gerät.",
  "Model metadata is unavailable. See the repository for training and evaluation details.":
    "Die Modellmetadaten sind nicht verfügbar. Details zu Training und Evaluation stehen im Repository.",
  "This interactive guide needs JavaScript. You can still read its explanation in the":
    "Diese interaktive Demo benötigt JavaScript. Die Erklärung findest du auch im",
  "GitHub repository": "GitHub-Repository",
  "DGN — Deutsche Gesellschaft für Neurologie":
    "DGN – Deutsche Gesellschaft für Neurologie",
  "DGN logo": "DGN-Logo",
  "Logo credit:": "Logo-Nachweis:",
  "Unmodified original.": "Unverändertes Original.",
};

export const LANGUAGE_STORAGE_KEY = "neural-networks-language";
export function preferredLanguage(storage) {
  try {
    return storage?.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "de";
  } catch {
    return "de";
  }
}

export function translateText(value, language) {
  if (language === "en" || !value.trim()) return value;
  const key = value.replace(/\s+/g, " ").trim();
  let result = german[key];
  if (result === undefined) {
    const rules = [
      [
        /^Inspect layer (\d+) neuron (\d+)$/,
        (_, l, n) => `Schicht ${l}, Neuron ${n} untersuchen`,
      ],
      [
        /^Layer (\d+) · neuron (\d+)$/,
        (_, l, n) => `Schicht ${l} · Neuron ${n}`,
      ],
      [/^Layer (\d+)( · \d+)?$/, (_, l, count) => `Schicht ${l}${count || ""}`],
      [/^(\d+) neurons$/, (_, n) => `${n} Neuronen`],
      [
        /^Inputs: (\d+) activations from layer (\d+)\.$/,
        (_, n, l) => `Eingaben: ${n} Aktivierungen aus Schicht ${l}.`,
      ],
      [
        /^Inspect transformer block (\d+)$/,
        (_, n) => `Transformer-Block ${n} untersuchen`,
      ],

      [/^Switch ([AB])$/, (_, n) => `Schalter ${n}`],
      [
        /^Inspect hidden neuron (\d+)$/,
        (_, n) => `Verdecktes Neuron ${n} untersuchen`,
      ],
      [
        /^Inside hidden neuron (h[₁₂]|\d+)$/,
        (_, n) => `Im verdeckten Neuron ${n}`,
      ],
      [
        /^Pixel row (\d+), column (\d+)$/,
        (_, r, c) => `Pixel in Zeile ${r}, Spalte ${c}`,
      ],
      [/^Load digit (\d)$/, (_, n) => `Ziffer ${n} laden`],
      [
        /^(.+) probability$/,
        (_, label) => `Wahrscheinlichkeit für ${translateText(label, "de")}`,
      ],
      [
        /^Reproducible check: (\d+)\/(\d+) fresh noisy samples of the same templates were classified correctly\. This tests robustness to similar pixel noise, not generalization to new handwriting styles\.$/,
        (_, n, total) =>
          `Reproduzierbare Prüfung: ${Number(n).toLocaleString("de-DE")}/${Number(total).toLocaleString("de-DE")} neue verrauschte Varianten derselben Vorlagen wurden korrekt erkannt. Das prüft die Robustheit gegenüber ähnlichem Pixelrauschen, nicht die Übertragbarkeit auf neue Handschriftstile.`,
      ],
    ];
    for (const [pattern, replacement] of rules) {
      if (pattern.test(key)) {
        result = key.replace(pattern, replacement);
        break;
      }
    }
    if (result === undefined) {
      // Only visible numeric text is localized; SVG geometry and input values are untouched.
      result = key
        .replace(/max\(0, /g, "max(0; ")
        .replace(/\bOFF(?=:)/g, "AUS")
        .replace(/\bON(?=:|\))/g, "AN")
        .replace(/(\d)\.(?=\d)/g, "$1,")
        .replace(/(\d)%/g, "$1 %");
    }
  }
  return value.match(/^\s*/)[0] + result + value.match(/\s*$/)[0];
}

// Store each DOM node's English source separately from its last rendered value.
// Later model updates can replace the source; changing language never resets the model.
const textRecords = new WeakMap();
const attributeRecords = new WeakMap();
const translatedAttributes = ["aria-label", "alt", "title"];

function translateCurrent(value, previous, language) {
  const source =
    previous && value === previous.rendered ? previous.source : value;
  return { source, rendered: translateText(source, language) };
}

export function localizeTree(root, language) {
  const document = root.ownerDocument || root;
  if (root.nodeType === 3) {
    if (root.parentElement?.closest("script, style, [translate='no']")) return;
    const record = translateCurrent(
      root.nodeValue,
      textRecords.get(root),
      language,
    );
    textRecords.set(root, record);
    if (root.nodeValue !== record.rendered) root.nodeValue = record.rendered;
    return;
  }
  const walker = document.createTreeWalker(root, 4); // NodeFilter.SHOW_TEXT
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("script, style, [translate='no']"))
      continue;
    const record = translateCurrent(
      node.nodeValue,
      textRecords.get(node),
      language,
    );
    textRecords.set(node, record);
    if (node.nodeValue !== record.rendered) node.nodeValue = record.rendered;
  }
  const elements = [
    ...(root.nodeType === 1 ? [root] : []),
    ...root.querySelectorAll("[aria-label], [alt], [title]"),
  ];
  for (const element of elements) {
    if (element.closest("[translate='no']")) continue;
    const records = attributeRecords.get(element) || {};
    for (const attribute of translatedAttributes) {
      if (!element.hasAttribute(attribute)) continue;
      const record = translateCurrent(
        element.getAttribute(attribute),
        records[attribute],
        language,
      );
      records[attribute] = record;
      if (element.getAttribute(attribute) !== record.rendered)
        element.setAttribute(attribute, record.rendered);
    }
    attributeRecords.set(element, records);
  }
}

export function initializeLanguage(document) {
  let storage;
  try {
    storage = document.defaultView.localStorage;
  } catch {
    /* Private-mode fallback. */
  }
  let language = preferredLanguage(storage);
  const metadata = [
    ...document.querySelectorAll(
      'meta[name="description"], meta[property^="og:"]',
    ),
  ].map((element) => [element, element.content]);
  const title = document.title;
  const observerOptions = {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: translatedAttributes,
  };
  const observer = new MutationObserver((records) => {
    observer.disconnect();
    // Translate only changed nodes. The tour's animation-frame timer must not
    // trigger a scan of every neuron, probability, and dialog on every frame.
    const changed = new Set();
    for (const record of records) {
      if (record.type === "childList") {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1 || node.nodeType === 3) changed.add(node);
        });
      } else changed.add(record.target);
    }
    for (const node of changed) {
      if (node.isConnected) localizeTree(node, language);
    }
    observer.observe(document.body, observerOptions);
  });
  function refresh() {
    observer.disconnect();
    localizeTree(document.body, language);
    document.documentElement.lang = language;
    document.title = translateText(title, language);
    metadata.forEach(
      ([element, source]) =>
        (element.content = translateText(source, language)),
    );
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === language),
      );
      button.classList.toggle("selected", button.dataset.language === language);
    });
    observer.observe(document.body, observerOptions);
  }
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.language;
      try {
        storage?.setItem(LANGUAGE_STORAGE_KEY, language);
      } catch {
        /* Choice still works for this visit. */
      }
      refresh();
    });
  });
  refresh();
  return {
    refresh,
    get language() {
      return language;
    },
  };
}
