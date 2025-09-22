class GlassesRecommender:
    def __init__(self):
        self.glasses_database = {
            "aviator": {
                "name": "Classic Aviator",
                "description": "Timeless teardrop shape with thin metal frames",
                "suitable_faces": ["oval", "square", "heart"],
                "style_notes": "Balances strong jawlines and adds width to narrow faces"
            },
            "round": {
                "name": "Round Frames",
                "description": "Circular lenses with various frame materials",
                "suitable_faces": ["oval", "square", "oblong"],
                "style_notes": "Softens angular features and complements geometric face shapes"
            },
            "rectangular": {
                "name": "Rectangular Frames",
                "description": "Straight lines and sharp angles",
                "suitable_faces": ["round", "oval", "heart"],
                "style_notes": "Adds structure and definition to soft face shapes"
            },
            "cat_eye": {
                "name": "Cat Eye",
                "description": "Upswept outer corners with vintage appeal",
                "suitable_faces": ["round", "square", "oval"],
                "style_notes": "Lifts features and adds sophistication"
            },
            "square": {
                "name": "Square Frames",
                "description": "Bold, geometric design with thick frames",
                "suitable_faces": ["round", "oval", "heart"],
                "style_notes": "Adds definition and contemporary style"
            },
            "wayfarer": {
                "name": "Wayfarer",
                "description": "Trapezoidal frame shape, slightly wider at top",
                "suitable_faces": ["oval", "round", "heart", "oblong"],
                "style_notes": "Versatile style that works with most face shapes"
            },
            "browline": {
                "name": "Browline",
                "description": "Prominent upper frame that mimics eyebrows",
                "suitable_faces": ["oval", "round", "heart"],
                "style_notes": "Adds definition to the upper face"
            },
            "oversized": {
                "name": "Oversized",
                "description": "Large frames that make a fashion statement",
                "suitable_faces": ["oval", "square", "oblong"],
                "style_notes": "Creates drama and covers more face area"
            }
        }
        
        self.face_shape_recommendations = {
            "oval": {
                "best_styles": ["aviator", "wayfarer", "rectangular", "round"],
                "avoid": [],
                "notes": "Oval faces can wear almost any style. Maintain the natural balance."
            },
            "round": {
                "best_styles": ["rectangular", "square", "cat_eye", "browline"],
                "avoid": ["round"],
                "notes": "Add angles and structure to complement the soft curves."
            },
            "square": {
                "best_styles": ["round", "aviator", "cat_eye", "oversized"],
                "avoid": ["square", "rectangular"],
                "notes": "Soften strong jawlines with curved frames."
            },
            "heart": {
                "best_styles": ["aviator", "rectangular", "wayfarer", "browline"],
                "avoid": ["cat_eye"],
                "notes": "Balance a wider forehead with frames that add width to the lower face."
            },
            "oblong": {
                "best_styles": ["wayfarer", "round", "oversized"],
                "avoid": ["rectangular"],
                "notes": "Add width and break up the length of the face."
            },
            "diamond": {
                "best_styles": ["cat_eye", "aviator", "browline", "wayfarer"],
                "avoid": ["rectangular"],
                "notes": "Highlight the eyes and add width to forehead and chin."
            }
        }
    
    def get_recommendations(self, face_shape, num_recommendations=3):
        """Get glasses recommendations for a given face shape"""
        if face_shape not in self.face_shape_recommendations:
            return []
        
        shape_info = self.face_shape_recommendations[face_shape]
        best_styles = shape_info["best_styles"][:num_recommendations]
        
        recommendations = []
        for style in best_styles:
            glasses_info = self.glasses_database[style]
            recommendations.append({
                "style": style,
                "name": glasses_info["name"],
                "description": glasses_info["description"],
                "reason": f"{glasses_info['style_notes']} - {shape_info['notes']}",
                "confidence": self._calculate_confidence(face_shape, style)
            })
        
        return recommendations
    
    def _calculate_confidence(self, face_shape, style):
        """Calculate confidence score for a recommendation"""
        shape_info = self.face_shape_recommendations[face_shape]
        
        if style in shape_info["best_styles"][:2]:
            return 0.9
        elif style in shape_info["best_styles"]:
            return 0.8
        elif style in shape_info["avoid"]:
            return 0.3
        else:
            return 0.6
    
    def get_all_styles_for_face(self, face_shape):
        """Get all glasses styles with suitability scores for a face shape"""
        all_recommendations = []
        
        for style, glasses_info in self.glasses_database.items():
            confidence = self._calculate_confidence(face_shape, style)
            all_recommendations.append({
                "style": style,
                "name": glasses_info["name"],
                "description": glasses_info["description"],
                "confidence": confidence,
                "suitable": face_shape in glasses_info["suitable_faces"]
            })
        
        # sort by confidence score
        all_recommendations.sort(key=lambda x: x["confidence"], reverse=True)
        return all_recommendations